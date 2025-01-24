import express from "express";
import { validateBody } from "../middleware/body-validator";
import { updatePostSchema, createPostSchema } from "./dto-schema";
import postsService from "./posts.service";
import { v4 } from "uuid";
import multer from "multer";
import { rename } from "fs/promises";

const POSTS_DISK_STORAGE_PATH = "./storage/posts";
const router = express.Router();
const postsImageStorage = multer.diskStorage({
  destination: POSTS_DISK_STORAGE_PATH,
});
const postsUploader = multer({ storage: postsImageStorage });

/**
 * @openapi
 * /posts/:
 *   post:
 *     description: Create new post
 *     security:
 *       - bearerAuth: []
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
router.post(
  "/",
  postsUploader.single("image"),
  validateBody(createPostSchema),
  async (req, res) => {
    const { id, createdAt } = await postsService.createPost(req.body);
    if (req.file)
      await rename(req.file.path, `${POSTS_DISK_STORAGE_PATH}/${id}.jpg`);
    res.send({
      message: "created new post",
      postID: id,
      date: createdAt,
    });
  }
);

/**
 * @openapi
 * /posts/:
 *   get:
 *     description: Get all posts
 *     security:
 *       - bearerAuth: []
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
    ? await postsService.getPostsBySenderID(senderID as string)
    : await postsService.getAllPosts();

  res.send(posts);
});

/**
 * @openapi
 * /posts/{postID}:
 *   get:
 *     description: Get post by id
 *     security:
 *       - bearerAuth: []
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

router.get("/image/:postID", async (req, res) => {
  const postID = req.params.postID;

  res.sendFile(`${POSTS_DISK_STORAGE_PATH}/${postID}.jpg`, { root: "." });
});

/**
 * @openapi
 * /posts/{postID}:
 *   put:
 *     description: Update post by id
 *     security:
 *       - bearerAuth: []
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
router.put(
  "/:postID",
  validateBody(updatePostSchema),
  postsUploader.single("image"),
  async (req, res) => {
    const postID = req.params.postID;
    const postDTO = req.body;

    const updatedAt = await postsService.updatePost(postID, postDTO);

    res.send({
      message: "Post updated",
      postID,
      date: updatedAt,
    });
  }
);
/**
 * @openapi
 * /posts/{postID}:
 *   delete:
 *     description: Delete post by id
 *     security:
 *       - bearerAuth: []
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
    res.status(404).send({
      message: "Post did not exist",
    });
  } else {
    res.send({
      message: "Post deleted",
      postID,
    });
  }
});

export default router;
