const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");
const middleware = require("../middleware");

router.use(express.json());

// GET /api/posts
// To get posts
router.get("/", async (req, res) => {
  let posts = await Post.findAll({
    include: [{ model: User }]
  });
  res.send(posts);
});

// POST /api/posts
// To post a post
router.post("/", middleware.tokenCheck, async (req, res) => {
  let { content } = req.body;

  try {
    let post = await Post.create({
      authorId: req.that_wall_user.userID,
      content
    });

    return res.send(post);
  } catch (error) {
    return res.send(error);
  }
});

module.exports = router;
