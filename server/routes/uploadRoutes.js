const path = require("path");
const admin = require("firebase-admin");
const uuid = require("uuid");
const multer = require("multer");
const multerGoogleStorage = require("multer-google-storage");
const mongoose = require("mongoose");

const Post = mongoose.model("Post");
const requireRegistration = require("../middlewares/requireRegistration");

const serviceAccount = require("path/to/serviceAccountKey.json"); // Update with your service account key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "your-firebase-storage-bucket-url",
});

const storageBucket = admin.storage().bucket();

const upload = multer({
  limits: {
    fileSize: 2000000,
  },
  storage: multerGoogleStorage.storageEngine({
    bucket: "your-firebase-storage-bucket-url",
    projectId: "your-firebase-project-id",
    keyFilename: "path/to/serviceAccountKey.json", // Update with your service account key file path
    filename: (req, file, cb) => {
      cb(null, `${req.user.id}/${uuid()}${path.extname(file.originalname)}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
      return cb(new Error("Only image files are allowed!"));
    }
    cb(null, true);
  },
});

module.exports = (app) => {
  app.post(
    "/api/upload",
    requireRegistration,
    upload.single("image"),
    async (req, res) => {
      try {
        let data = JSON.parse(req.body.data);
        const { title, tags, description } = data;
        const post = await new Post({
          _owner: req.user.id,
          title,
          title_lower: title,
          description,
          createdAt: Date.now(),
          // ! key and other file props available on req.file/files
          imgUrl: req.file.filename, // Update with Firebase file URL
          tags,
        });
        await post.save();
        res
          .status(200)
          .send({ success: "Post has been added!", postData: post });
      } catch (e) {
        res.status(200).send({
          error:
            "Could not add post. Please check html form input and upload file.",
        });
      }
    }
  );

  app.delete("/api/delete", async (req, res) => {
    try {
      const { img: imgUrl, id: postId } = req.query;
      const userId = imgUrl.split("/")[0];

      // Check if user owns post
      if (req.user.id === userId) {
        await Post.findByIdAndDelete(postId);
        const file = storageBucket.file(imgUrl);
        await file.delete();
        res.status(200).send({ success: "Post deleted" });
      } else {
        return res
          .status(401)
          .send({ error: "You are not authorized to delete this post." });
      }
    } catch (e) {
      console.log(e);
      res.status(500).send({ error: "Internal server error" });
    }
  });
};
