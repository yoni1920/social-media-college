import express from "express";
import { validateBody } from "../middleware/body-validator";
import {
  updatePostSchema,
  createPostSchema,
  POSTS_DISK_STORAGE_PATH,
  likePostSchema,
  LikePostDTO,
  LikeMethod,
} from "./dto-schema";
import postsService from "./posts.service";
import multer from "multer";
import { BadRequestException } from "../exceptions";
import storageService from "../file-storage/storage.service";

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
    if (!req.file)
      throw new BadRequestException("Can't upload post without file", {});
    const { id, createdAt } = await postsService.createPost(req.body, req.file);

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
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: number
 *         default: 50
 *       - name: offset
 *         in: query
 *         required: false
 *         schema:
 *           type: number
 *         default: 0
 *     responses:
 *       200:
 *         description: Returns an array of posts
 *       400:
 *         description: Bad request
 */
router.get("/", async (req, res) => {
  const { senderID, limit, offset } = req.query;
  const posts = senderID
    ? await postsService.getPostsBySenderID(
        senderID as string,
        Number(limit),
        Number(offset)
      )
    : await postsService.getAllPosts(Number(limit), Number(offset));

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
  const { postID } = req.params;

  const fileDirectory = await storageService.getFileDirectory(
    POSTS_DISK_STORAGE_PATH,
    postID,
    req.query.fileName as string | undefined
  );

  res.sendFile(fileDirectory, {
    root: ".",
  });
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

    const updatedAt = await postsService.updatePost(postID, postDTO, req.file);

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
router.patch(
  "/:postID/likes",
  validateBody(likePostSchema),
  async (req, res) => {
    const postID = req.params.postID;
    const likePostDTO: LikePostDTO = req.body;

    likePostDTO.method === LikeMethod.LIKE
      ? await postsService.likePost(postID, likePostDTO.user)
      : await postsService.unlikePost(postID, likePostDTO.user);

    res.send({ message: "liked method success", postID });
  }
);

export default router;
