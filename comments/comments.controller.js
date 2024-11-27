import express from "express";
import { validateBody } from "../middleware/body-validator.js";
import { createCommentSchema } from "./dto-schema/create-comment.dto.js";
import { updateCommentSchema } from "./dto-schema/update-comment.dto.js";
import commentsService from "./comments.service.js";

const router = express.Router();

router.post("/", validateBody(createCommentSchema), async (req, res) => {
  const { id, createdAt } = await commentsService.createComment(req.body);

  res.send({
    message: "created new comment",
    commentID: id,
    date: createdAt,
  });
});

router.get("/", async (req, res) => {
  const postID = req.query.postID;

  const comments = postID
    ? await commentsService.getCommentsByPostID(postID)
    : await commentsService.getAllComments();

  console.log(comments);

  res.send(comments);
});

router.get("/:commentID", async (req, res) => {
  const commentID = req.params.commentID;
  const comment = await commentsService.getCommentByID(commentID);

  res.send(comment);
});

router.put(
  "/:commentID",
  validateBody(updateCommentSchema),
  async (req, res) => {
    const commentID = req.params.commentID;
    const commentDTO = req.body;

    const updatedAt = await commentsService.updateComment(
      commentID,
      commentDTO
    );

    res.send({
      message: "Comment updated",
      commentID,
      date: updatedAt,
    });
  }
);

router.delete("/:commentID", async (req, res) => {
  const commentID = req.params.commentID;

  const isDeleted = await commentsService.deleteComment(commentID);

  if (!isDeleted) {
    return res.status(404).send({
      message: "Comment did not exist",
    });
  }

  res.send({
    message: "Comment deleted",
    commentID,
  });
});

export default router;
