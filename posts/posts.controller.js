import express from "express";
import { validateBody } from "../middleware/body-validator.js";
import { createPostSchema } from "./dto-schema/create-post.dto.js";
import { updatePostSchema } from "./dto-schema/update-post.dto.js";
import postsService from "./posts.service.js";

const router = express.Router();

router.post("/", validateBody(createPostSchema), async (req, res) => {
  const { id, createdAt } = await postsService.createPost(req.body);

  res.send({
    message: "created new post",
    postID: id,
    date: createdAt,
  });
});

router.get("/", async (req, res) => {
  const senderID = req.query.senderID;

  const posts = senderID
    ? await postsService.getPostsBySenderID(senderID)
    : await postsService.getAllPosts();

  res.send(posts);
});

router.get("/:postID", async (req, res) => {
  const postID = req.params.postID;
  const post = await postsService.getPostByID(postID);

  res.send(post);
});

router.put("/:postID", validateBody(updatePostSchema), async (req, res) => {
  const postID = req.params.postID;
  const postDTO = req.body;

  const updatedAt = await postsService.updatePost(postID, postDTO);

  res.send({
    message: "Post updated",
    postID,
    date: updatedAt,
  });
});

router.delete("/:postID", async (req, res) => {
  const postID = req.params.postID;

  const isDeleted = await postsService.deletePost(postID);

  res.send({
    message: isDeleted ? "Post deleted" : "Post did not exist",
    postID,
  });
});

export default router;
