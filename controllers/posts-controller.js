import express from "express";
import postsService from "../services/posts-service.js ";

const router = express.Router();

// New Post
router.post("/", (req, res) => {
  res.send({
    message: "created new post",
  });
});

// Get all posts
router.get("/", (req, res) => {
  res.send([]);
});

// Get post by id
router.get("/:postID", (req, res) => {
  res.send({});
});

// Get post by sender
// query param, merge with posts
router.get("/:postID", (req, res) => {
  res.send({});
});

// update post
router.put("/:postID", (req, res) => {
  res.send({});
});

export default router;
