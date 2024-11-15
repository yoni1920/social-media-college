import express from "express";
import { validateBody } from "../middleware/body-validator.js";
import { createPostSchema } from "./dto-schema/create-post.dto.js";
import { updatePostSchema } from "./dto-schema/update-post.dto.js";
import { runAsync } from "../middleware/run-async.js";
import postsService from "./posts.service.js";

const router = express.Router();

router.post(
  "/",
  validateBody(createPostSchema),
  runAsync(async (req, res) => {
    const { id, createdAt } = await postsService.createPost(req.body);

    res.send({
      message: "created new post",
      postId: id,
      date: createdAt,
    });
  })
);

router.get(
  "/",
  runAsync(async (req, res) => {
    const sender = req.query.sender;

    const posts = sender
      ? await postsService.getPostsBySender(sender)
      : await postsService.getAllPosts();

    res.send(posts);
  })
);

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
router.put("/:postID", validateBody(updatePostSchema), (req, res) => {
  res.send({});
});

export default router;
