import express from "express";
import { validateBody } from "../middleware/body-validator.js";
import { createCommentSchema } from "./dto-schema/create-comment.dto.js";
import { updateCommentSchema } from "./dto-schema/update-comment.dto.js";
import commentsService from "./comments.service.js";

const router = express.Router();

/**
 * @openapi
 * /comments/:
 *   post:
 *     description: Create new comment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *               - postID
 *               - sender
 *             properties:
 *               message:
 *                 type: string
 *                 required: true
 *                 example: AAA
 *               postID:
 *                 type: string
 *                 required: true
 *                 example: 1234-1234
 *               sender:
 *                 type: string
 *                 required: true
 *                 example: Avni
 *     responses:
 *       200:
 *         description: Returns the created comment id
 *       400:
 *         description: Bad request
 */
router.post("/", validateBody(createCommentSchema), async (req, res) => {
  const { id, createdAt } = await commentsService.createComment(req.body);

  res.send({
    message: "created new comment",
    commentID: id,
    date: createdAt,
  });
});

/**
 * @openapi
 * /comments/:
 *   get:
 *     description: Get all comments
 *     parameters:
 *       - name: postID
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         allowEmptyValue: true
 *     responses:
 *       200:
 *         description: Returns an array of comments
 *         schema:
 *           type: array
 *       400:
 *         description: Bad request
 */
router.get("/", async (req, res) => {
  const postID = req.query.postID;

  const comments = postID
    ? await commentsService.getCommentsByPostID(postID)
    : await commentsService.getAllComments();

  console.log(comments);

  res.send(comments);
});

/**
 * @openapi
 * /comments/{commentID}:
 *   get:
 *     description: Get comment by id
 *     parameters:
 *       - name: commentID
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns an array of comments
 *         schema:
 *           type: array
 *       400:
 *         description: Bad request
 */
router.get("/:commentID", async (req, res) => {
  const commentID = req.params.commentID;
  const comment = await commentsService.getCommentByID(commentID);

  res.send(comment);
});

/**
 * @openapi
 * /comments/{commentID}:
 *   put:
 *     description: Update comment by id
 *     parameters:
 *       - name: commentID
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            required:
 *              - message
 *            properties:
 *              message:
 *                type: string
 *                required: true
 *                example: AAA
 *     responses:
 *       200:
 *         description: Comment updated
 *       400:
 *         description: Bad request
 *
 * */
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

/**
 * @openapi
 * /comments/{commentID}:
 *   delete:
 *     description: Delete comment by id
 *     parameters:
 *       - name: commentID
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted
 *       400:
 *         description: Bad request
 */
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
