import express from "express";
import multer from "multer";
import { BadRequestException } from "../exceptions";
import storageService from "../file-storage/storage.service";
import { validateBody } from "../middleware/body-validator";
import {
  createPostSchema,
  LikeMethod,
  LikePostDTO,
  likePostSchema,
  POSTS_DISK_STORAGE_PATH,
  updatePostSchema,
} from "./dto-schema";
import {
  EnhanceCaptionRequestDTO,
  enhanceCaptionRequestSchema,
} from "./dto-schema/enhance-caption";
import captionService from "./services/caption.service";
import postsService from "./services/posts.service";

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
 * /posts/image/{postID}:
 *   get:
 *     description: Get post image by post id
 *     parameters:
 *       - name: postID
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns image file of post
 */
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
 * /posts/{postID}/likes:
 *   patch:
 *     description: Update like count based on method
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *               - method
 *             properties:
 *               method:
 *                 type: string
 *                 required: true
 *                 example: UNLIKE
 *               user:
 *                 type: string
 *                 required: true
 *                 example: 1234
 *     responses:
 *       200:
 *         description: Successfully updated likes
 *       400:
 *         description: Bad request
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

/**
 * @openapi
 * /posts/caption:
 *   post:
 *     description: Enhance post caption, with method and optional translation language
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userID
 *               - caption
 *               - enhanceOption
 *             properties:
 *               userID:
 *                 type: string
 *                 required: true
 *                 example: 1234
 *               caption:
 *                 type: string
 *                 required: true
 *                 example: Hello
 *               enhanceOption:
 *                 type: string
 *                 required: true
 *                 example: PARAPHRASE
 *               translationLanguage:
 *                 type: string
 *                 required: false
 *                 example: FRENCH
 *     responses:
 *       200:
 *         description: Returns enhanced caption or error with reason
 *       400:
 *         description: Bad request
 */
router.post(
  "/caption",
  validateBody(enhanceCaptionRequestSchema),
  async (req, res) => {
    const enhanceRequest: EnhanceCaptionRequestDTO = req.body;
    const response = await captionService.enhanceCaption(enhanceRequest);

    res.send(response);
  }
);

export default router;
