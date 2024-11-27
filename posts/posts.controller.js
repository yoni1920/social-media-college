import express from "express";
import { validateBody } from "../middleware/body-validator.js";
import { createPostSchema } from "./dto-schema/create-post.dto.js";
import { updatePostSchema } from "./dto-schema/update-post.dto.js";
import postsService from "./posts.service.js";

const router = express.Router();

/**
 * @openapi
 * /posts/:
 *   post:
 *     description: Create new post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *               - sender
 *             properties:
 *               message:
 *                 type: string
 *                 required: true
 *                 example: AAA
 *               sender:
 *                 type: string
 *                 required: true
 *                 example: Avni
 *     responses:
 *       200:
 *         description: Returns the created post id
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: created new post
 *             postID:
 *               type: string
 *               example: 1234-1234
 *             date:
 *               type: string
 *       400:
 *         description: Bad request
 */
router.post("/", validateBody(createPostSchema), async (req, res) => {
  const { id, createdAt } = await postsService.createPost(req.body);

  res.send({
    message: "created new post",
    postID: id,
    date: createdAt,
  });
});

/**
 * @openapi
 * /posts/:
 *   get:
 *     description: Get all posts
 *     parameters:
 *       - name: senderID
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         allowEmptyValue: true
 *     responses:
 *       200:
 *         description: Returns an array of posts
 *       400:
 *         description: Bad request
 */
router.get("/", async (req, res) => {
  const senderID = req.query.senderID;

  const posts = senderID
    ? await postsService.getPostsBySenderID(senderID)
    : await postsService.getAllPosts();

  res.send(posts);
});

/**
 * @openapi
 * /posts/{postID}:
 *   get:
 *     description: Get post by id
 *     parameters:
 *       - name: postID
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns an array of posts
 *       400:
 *         description: Bad request
 */
router.get("/:postID", async (req, res) => {
  const postID = req.params.postID;
  const post = await postsService.getPostByID(postID);

  res.send(post);
});

/**
 * @openapi
 * /posts/{postID}:
 *   put:
 *     description: Update post by id
 *     parameters:
 *       - name: postID
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
 *         description: Post updated
 *       400:
 *         description: Bad request
 */
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
/**
 * @openapi
 * /posts/{postID}:
 *   delete:
 *     description: Delete post by id
 *     parameters:
 *       - name: postID
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post deleted
 *       400:
 *         description: Bad request
 *       404:
 *         description: Post not found
 */
router.delete("/:postID", async (req, res) => {
  const postID = req.params.postID;

  const isDeleted = await postsService.deletePost(postID);

  if (!isDeleted) {
    return res.status(404).send({
      message: "Post did not exist",
    });
  }

  return res.send({
    message: "Post deleted",
    postID,
  });
});

export default router;
