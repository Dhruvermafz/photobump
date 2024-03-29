const requireRegistration = require("../middlewares/requireRegistration");
const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const User = mongoose.model("User");
const Faves = mongoose.model("Faves");
const Follows = mongoose.model("Follows");

module.exports = (app) => {
  //Main Page context: new
  app.get("/api/posts/new/:page", async (req, res) => {
    try {
      const { page } = req.params;

      const posts = await Post.find({})
        .sort({ createdAt: -1 })
        .limit(12)
        .skip(12 * page)
        .populate({
          path: "_owner",
          select: "profilePhoto displayName",
        })
        .exec();

      if (req.user && req.user.registered) {
        const favesDoc = await Faves.findOne(
          {
            _owner: req.user.id,
          },
          "faves",
          { lean: true }
        );
        const { _faves } = favesDoc;

        posts.forEach((post) => {
          if (_faves.toString().includes(post._id)) {
            return (post.isFave = true);
          }
        });

        return res.send(posts);
      }
      res.send(posts);
    } catch (error) {
      console.log(e);
    }
  });

  // MainPage context : Popular
  app.get("/api/posts/popular/:page", async (req, res) => {
    try {
      const { page } = req.params;

      const posts = await Post.aggregate([
        { $sort: { createdAt: -1 } },
        { $skip: 12 * page },
        { $limit: 12 },
        { $sort: { faveCount: -1 } },
      ]).exec();

      await Post.populate(posts, {
        path: "_owner",
        select: "displayName profilePhoto",
      });

      if (req.user && req.user.registered) {
        const favesDoc = await Faves.findOne(
          { _owner: req.user.id },
          "_faves",
          { lean: true }
        );
        const { _faves } = favesDoc;

        posts.forEach((post) => {
          if (_faves.toString().includes(post._id)) {
            return (post.isFave = true);
          }
        });

        return res.send(posts);
      }

      res.send(posts);
    } catch (e) {
      console.log(e);
    }
  });

  // MainPage context: Follows Feed
  app.get("/api/posts/follows/:page", requireRegistration, async (req, res) => {
    try {
      const { page } = req.params;
      const follows = await Follows.find({ _owner: req.user.id }, "follows");
      console.log("FOLLOWS: ", follows[0].follows);
      const posts = await Post.find({ _owner: { $in: follows[0].follows } })
        .sort({ createdAt: -1 })
        .limit(12)
        .skip(12 * page)
        .populate({ path: "_owner", select: "displayName profilePhoto" })
        .exec();

      res.status(200).send(posts);
    } catch (e) {
      console.log(e);
    }
  });

  // ProfilePage context: User posts all
  app.get("/api/posts/user/all/:user/:page", async (req, res) => {
    try {
      const { page, user } = req.params;
      console.log(page, user);

      const userId = await User.find({ displayName: user }, "_id");
      console.log(userId);
      const posts = await Post.find({ _owner: userId })
        .populate({
          path: "_owner",
          select: "profilePhoto displayName",
        })
        .limit(12)
        .skip(12 * page)
        .exec();

      if (req.user && req.user.registered) {
        const favesDoc = await Faves.findOne(
          { _owner: req.user.id },
          "_faves",
          { lean: true }
        );
        const { _faves } = favesDoc;

        posts.forEach((post) => {
          if (_faves.toString().includes(post._id)) {
            return (post.isFave = true);
          }
        });

        return res.status(200).send(posts);
      }

      res.status(200).send(posts);
    } catch (e) {
      console.log(e);
    }
  });

  app.patch("/api/posts/edit/:id", async (req, res) => {
    try {
      const { title, tags, description } = req.body;
      const { id } = req.params;

      console.log(title, tags, description);

      await Post.findOneAndUpdate(
        { _id: id, _owner: req.user.id },
        {
          title,
          title_lower: title,
          tags,
          description,
        }
      );
      res.status(200).send({ success: "Update post successfully" });
    } catch (e) {
      console.log(e);
    }
  });

  // ProfilePage context: User faves all
  app.get("/api/posts/user/faves/:user/:page", async (req, res) => {
    try {
      const { page, user } = req.params;

      const faves = await Faves.find({ _displayName: user })
        .populate({
          path: "_faves",
          select: "_id",
        })
        .exec();

      const favesArray = faves[0]._faves;

      const posts = await Post.find({ _id: { $in: favesArray } })
        .populate({ path: "_owner", select: "profilePhoto displayName" })
        .limit(12)
        .skip(12 * page)
        .exec();

      if (req.user && req.user.registered) {
        const favesDoc = await Faves.findOne(
          { _owner: req.user.id },
          "_faves",
          { lean: true }
        );
        const { _faves } = favesDoc;

        posts.forEach((post) => {
          if (_faves.toString().includes(post._id)) {
            return (post.isFave = true);
          }
        });

        return res.status(200).send(posts);
      }

      res.status(200).send(posts);
    } catch (e) {
      console.log(e);
    }
  });

  // Get all user posts (protected) for AlbumMaker
  app.get(
    "/api/posts/myposts/all/:page",
    requireRegistration,
    async (req, res) => {
      try {
        const userId = req.user.id;
        const { page } = req.params;

        const posts = await Post.find({ _owner: userId })
          .sort({ createdAt: -1 })
          .skip(50 * page)
          .limit(50)
          .select("imgUrl")
          .exec();

        res.status(200).send(posts);
      } catch (e) {
        console.log(e);
      }
    }
  );

  // Get single post
  app.get("/api/posts/single/:id", async (req, res) => {
    try {
      const post = await Post.findOne(
        { _id: req.params.id },
        "-comments"
      ).populate({ path: "_owner", select: "displayName profilePhoto" });
      if (req.user && req.user.registered) {
        const favesDoc = await Faves.findOne(
          { _owner: req.user.id },
          "_faves",
          { lean: true }
        );
        const { _faves } = favesDoc;

        if (_faves.toString().includes(post._id)) {
          post.isFave = true;
        }

        return res.status(200).send(post);
      }
      res.status(200).send(post);
    } catch (e) {
      console.log(e);
    }
  });

  // Get post comments
  app.get("/api/posts/comments/all/:postId/:page", async (req, res) => {
    try {
      const { postId, page } = req.params;

      const postComments = await Post.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(postId) } },
        { $unwind: "$comments" },
        {
          $lookup: {
            from: "users",
            localField: "comments._owner",
            foreignField: "_id",
            as: "comments._owner",
          },
        },
        {
          $project: {
            "comments._id": 1,
            "comments.createdAt": 1,
            "comments.body": 1,
            "comments._owner._id": 1,
            "comments._owner.displayName": 1,
            "comments._owner.profilePhoto": 1,
          },
        },
        { $unwind: "$comments._owner" },
        { $replaceRoot: { newRoot: "$comments" } },
        { $sort: { createdAt: -1 } },
        { $skip: 20 * page },
        { $limit: 20 },
        { $sort: { createdAt: 1 } },
      ]);

      res.status(200).send(postComments);
    } catch (e) {
      console.log(e);
    }
  });

  // Add a comment
  app.post(
    "/api/posts/comments/add/:postId",
    requireRegistration,
    async (req, res) => {
      try {
        const { commentBody } = req.body;
        const comment = {
          _owner: req.user.id,
          createdAt: Date.now(),
          body: commentBody,
        };
        await Post.findOneAndUpdate(
          { _id: req.params.postId },
          { $push: { comments: comment }, $inc: { commentCount: 1 } },
          { new: true }
        );
        res.status(200).send({ success: "Comment added" });
      } catch (e) {
        console.log(e);
      }
    }
  );

  // Search by tag or title
  app.post("/api/posts/search/:page", async (req, res) => {
    try {
      const { searchTerms } = req.body;
      const { page } = req.params;

      const posts = await Post.find({
        $or: [
          { tags: { $in: searchTerms } },
          { title_lower: { $in: searchTerms } },
        ],
      })
        .populate({ path: "_owner", select: "profilePhoto displayName" })
        .limit(12)
        .skip(12 * page)
        .exec();

      res.status(200).send(posts);
    } catch (e) {
      console.log(e);
    }
  });

  // Fave
  app.post("/api/posts/fave/:id", requireRegistration, async (req, res) => {
    try {
      const postId = mongoose.Types.ObjectId(req.params.id);
      const fave = await Faves.findOne(
        {
          _owner: req.user.id,
          _faves: postId,
        },
        { "_faves.$": postId }
      );
      console.log(fave);
      if (!fave) {
        await Faves.findOneAndUpdate(
          { _owner: req.user.id },
          { $push: { _faves: postId } },
          { upsert: true }
        );
        await Post.findOneAndUpdate(
          { _id: postId },
          { $inc: { faveCount: 1 } },
          { new: true }
        );
        return res.status(200).send({ success: "Post faved!" });
      }

      await fave.update({ $pull: { _faves: postId } });
      await Post.findOneAndUpdate(
        { _id: postId },
        { $inc: { faveCount: -1 } },
        { new: true }
      );

      res.status(200).send({ success: "Post unfaved!" });
    } catch (e) {
      console.log(e);
    }
  });
};
