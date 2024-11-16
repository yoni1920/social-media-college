import express from "express";
import { validateBody } from "../middleware/body-validator.js";
import { createCommentSchema } from "./dto-schema/create-comment.dto.js";
import { updateCommentSchema } from "./dto-schema/update-comment.dto.js";
import { runAsync } from "../middleware/run-async.js";
import commentsService from "./comments.service.js";

const router = express.Router();

router.post(
  "/",
  validateBody(createCommentSchema),
  runAsync(async (req, res) => {
    const { id, createdAt } = await commentsService.createComment(req.body);

    res.send({
      message: "created new comment",
      commentID: id,
      date: createdAt,
    });
  })
);

router.get(
  "/",
  runAsync(async (req, res) => {
    const postID = req.query.postID;

    const comments = postID
      ? await commentsService.getCommentsByPostID(postID)
      : await commentsService.getAllComments();

    res.send(comments);
  })
);

router.get(
  "/:commentID",
  runAsync(async (req, res) => {
    const commentID = req.params.commentID;
    const Comment = await commentsService.getCommentByID(commentID);

    if (!Comment) {
      res.status(400).send({
        message: "Comment does not exist",
        commentID,
      });
    } else {
      res.send(Comment);
    }
  })
);

router.put(
  "/:commentID",
  validateBody(updateCommentSchema),
  runAsync(async (req, res) => {
    const commentID = req.params.commentID;
    const commentDTO = req.body;

    const { updatedExisting, updatedAt } = await commentsService.updateComment(
      commentID,
      commentDTO
    );

    if (!updatedExisting) {
      res.status(400).send({
        message: "Comment to update does not exist",
        commentID,
      });
    } else {
      res.send({
        message: "Comment updated",
        commentID,
        date: updatedAt,
      });
    }
  })
);

router.delete(
  "/:commentID",
  runAsync(async (req, res) => {
    const commentID = req.params.commentID;

    const isDeleted = await commentsService.deleteComment(commentID);

    res.send({
      message: isDeleted ? "Comment deleted" : "Comment did not exist",
      commentID,
    });
  })
);

export default router;
