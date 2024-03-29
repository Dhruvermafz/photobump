const mongoose = require("mongoose");
const requireRegistration = require("../middlewares/requireRegistration");
const User = mongoose.model("User");
const Follows = mongoose.model("Follows");
const Followers = mongoose.model("Followers");

module.exports = (app) => {
  // Update profile
  app.post("/api/profile/update", requireRegistration, async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        { _id: req.user.id },
        { profile: req.body.profile }
      );
      res.status(200).send(user);
    } catch (e) {
      console.log(e);
    }
  });

  //get a user's profile
  app.get("/api/profile/get/:user", async (req, res) => {
    try {
      const user = await User.findOne({ displayName: req.params.user });
      if (!user) {
        throw new Error();
      }
    } catch (e) {
      console.log(e);
      res.status(404).send({ error: "Profile not found." });
    }
  });

  // Search for profile
  app.post("/api/profile/search/:page", async (req, res) => {
    try {
      const { searchTerms } = req.body;
      const { page } = req.params;
      const regexArr = searchTerms.map((term) => {
        return new RegExp(term, "g");
      });
      const users = await User.find({
        displayName_lower: {
          $in: regexArr,
        },
      })
        .limit(20)
        .skip(2 * page)
        .exec();
      res.status(200).send(users);
    } catch (error) {
      console.log(error);
    }
  });

  // get following and followers count and clientFollows
  app.get("/api/profile/count/:user", async (req, res) => {
    try {
      let clientId;
      req.user
        ? (clientId = mongoose.Types.ObjectId(req.user.id))
        : (clientId = null);
      console.log(clientId);
      const follows = await Follows.aggregate([
        { $match: { _displayName: req.params.user } },
        { $addFields: { followsCount: { $size: "$follows" } } },
        {
          $lookup: {
            from: "followers",
            localField: "_owner",
            foreignField: "_owner",
            as: "followers",
          },
        },
        { $unwind: { path: "$followers", preserveNullAndEmptyArrays: true } },
        {
          $addFields: {
            followersCount: { $size: "$followers.followers" },
            clientFollows: {
              $cond: [
                { $setIsSubset: [[clientId], "$followers.followers"] },
                true,
                false,
              ],
            },
          },
        },
        {
          $project: {
            _id: 0,
            follows: 0,
            followers: 0,
            _owner: 0,
          },
        },
      ]);
      console.log(follows);
      res.send(follows[0]);
    } catch (e) {
      console.log(e);
      res.status(400).send({ error: "Not Found" });
    }
  });

  // get a user's followers
  app.get("/api/profile/followers/:id/:page", async (req, res) => {
    try {
      const { id, page } = req.params;
      const followersDoc = await Followers.find({ _owner: id })
        .limit(25)
        .skip(25 * page)
        .populate({
          path: "followers",
          select: "displayName profilePhoto joined",
        })
        .exec();

      if (!followersDoc[0]) {
        return res.status(200).send([]);
      }
      const { followers } = followersDoc[0];
      res.status(200).send(followers);
    } catch (e) {
      console.log(e);
    }
  });

  // get a user's follows
  app.get("/api/profile/follows/:id/:page", async (req, res) => {
    try {
      const { id, page } = req.params;
      const followersDoc = await Follows.find({ _owner: id }, "follows")
        .limit(25)
        .skip(25 * page)
        .populate({
          path: "follows",
          select: "displayName profilePhoto joined",
        })
        .exec();

      if (!followersDoc[0]) {
        return res.status(200).send([]);
      }

      const { follows } = followersDoc[0];
      res.status(200).send(follows);
    } catch (error) {
      console.log(e);
    }
  });

  // follows a user
  app.post(
    "/api/profile/follows/add/:id",
    requireRegistration,
    async (req, res) => {
      try {
        const clientId = req.user.id;
        const { id } = req.params;
        if (clientId === id) {
          return res.status(400).send({ error: "Can't add self." });
        }
        const follows = await Follows.findByIdAndUpdate(
          { _owner: clientId },
          { $addToSet: { follows: id } }
        );

        res.status(200).send(follows);
      } catch (error) {
        console.log(e);
      }
    }
  );

  // unfollow a user
  app.delete(
    "/api/profile/follows/unf/:id",
    requireRegistration,
    async (req, res) => {
      try {
        const clientId = req.user.id;
        const { id } = req.params;

        if (clientId === id) {
          return res.status(400).send({ error: "Can't unfollow self." });
        }

        const follows = await Follows.findOneAndUpdate(
          { _owner: clientId },
          { $pull: { follows: id } }
        );

        await Followers.findByIdAndUpdate(
          { _owner: id },
          { $pull: { followers: clientId } }
        );
        res.status(200).send(follows);
      } catch (error) {
        console.log(error);
      }
    }
  );
};
