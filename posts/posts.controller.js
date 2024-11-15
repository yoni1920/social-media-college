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
      postID: id,
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

router.get(
  "/:postID",
  runAsync(async (req, res) => {
    const postID = req.params.postID;
    const post = await postsService.getPostByID(postID);

    if (!post) {
      res.status(400).send({
        message: "Post does not exist",
        postID,
      });
    } else {
      res.send(post);
    }
  })
);

router.put(
  "/:postID",
  validateBody(updatePostSchema),
  runAsync(async (req, res) => {
    const postID = req.params.postID;
    const postDTO = req.body;

    const { updatedExisting, updatedAt } = await postsService.updatePost(
      postID,
      postDTO
    );

    if (!updatedExisting) {
      res.status(400).send({
        message: "Post to update does not exist",
        postID,
      });
    } else {
      res.send({
        message: "Post updated",
        postID,
        date: updatedAt,
      });
    }
  })
);

export default router;
