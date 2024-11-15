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
router.get(
  "/:postID",
  runAsync(async (req, res) => {
    const postID = req.params.postID;
    const post = await postsService.getPostByID(postID);

    if (!post) {
      res.status(400).send({
        message: "Post does not exist",
      });
    } else {
      res.send(post);
    }
  })
);

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
