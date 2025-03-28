import express from "express";
import { validateBody } from "../middleware/body-validator";
import { createUserSchema, updateUserSchema } from "./dto-schema";
import usersService from "./users.service";
import multer from "multer";
import {
  DEFAULT_PROFILE_PICTURE_FILE,
  DEFAULT_PROFILE_PICTURE_KEYWORD,
  USER_PICTURE_STORAGE_PATH,
} from "./constants";
import storageService from "../file-storage/storage.service";
import {
  ACCESS_TOKEN_COOKIE_KEY,
  REFRESH_TOKEN_COOKIE_KEY,
} from "../auth/constants";
const router = express.Router();

const userPictureStorage = multer.diskStorage({
  destination: USER_PICTURE_STORAGE_PATH,
});

const userPictureUploader = multer({ storage: userPictureStorage });

/**
 * @openapi
 * /users/:
 *   post:
 *     description: Create new user
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - username
 *              - password
 *              - email
 *            properties:
 *              username:
 *                type: string
 *                required: true
 *                example: idoavni
 *              email:
 *                type: string
 *                required: true
 *                example: 4o5e6@example.com
 *              bio:
 *                type: string
 *                required: false
 *                example: Lorem ipsum dolor sit amet consectetur adipiscing elit
 *     responses:
 *       200:
 *         description: Returns the created user id
 *       400:
 *         description: Bad request
 */
router.post("/", validateBody(createUserSchema), async (req, res) => {
  const { _id: id, createdAt } = await usersService.createUser(req.body);

  res.send({
    message: "created new user",
    userID: id,
    date: createdAt,
  });
});

/**
 * @openapi
 * /users/:
 *   get:
 *     description: Get all users
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Returns an array of users
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized user
 */
router.get("/", async (_req, res) => {
  const users = await usersService.getAllUsers();

  res.send(users);
});

/**
 * @openapi
 * /users/{userID}:
 *   get:
 *     description: Get user by id
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: userID
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns an array of users
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized user
 */
router.get("/:userID", async (req, res) => {
  const userID = req.params.userID;
  const user = await usersService.getUserByID(userID);

  res.send(user);
});

/**
 * @openapi
 * /users/{userID}:
 *   put:
 *     description: Update user by id
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: userID
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
 *            properties:
 *              username:
 *                type: string
 *                required: false
 *                example: idoavni
 *              email:
 *                type: string
 *                required: false
 *                example: 4o5e6@example.com
 *              bio:
 *                type: string
 *                required: false
 *                example: Lorem ipsum dolor sit amet consectetur adipiscing elit
 *     responses:
 *       200:
 *         description: Returns updated user
 *         schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *              userID:
 *                type: string
 *              date:
 *                type: string
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized user
 */
router.put(
  "/:userID",
  validateBody(updateUserSchema),
  userPictureUploader.single("image"),
  async (req, res) => {
    const userID = req.params.userID;
    const userDTO = req.body;

    const updatedAt = await usersService.updateUser(userID, userDTO, req.file);

    res.send({
      message: "User updated",
      userID,
      date: updatedAt,
    });
  }
);

/**
 * @openapi
 * /users/{userID}:
 *   delete:
 *     description: Delete user by id
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: userID
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User successfully deleted
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized user
 */
router.delete("/:userID", async (req, res) => {
  const userID = req.params.userID;

  const isDeleted = await usersService.deleteUser(userID);

  if (!isDeleted) {
    res.status(404).send({
      message: "User did not exist",
    });
  } else {
    res
      .clearCookie(REFRESH_TOKEN_COOKIE_KEY)
      .clearCookie(ACCESS_TOKEN_COOKIE_KEY)
      .send({
        message: "User deleted",
        userID,
      });
  }
});

router.get("/image/:userID", async (req, res) => {
  const { userID } = req.params;
  const fileName = req.query.fileName;

  const fileDirectory =
    fileName === DEFAULT_PROFILE_PICTURE_KEYWORD
      ? DEFAULT_PROFILE_PICTURE_FILE
      : await storageService.getFileDirectory(
          USER_PICTURE_STORAGE_PATH,
          userID,
          fileName as string | undefined
        );

  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  res.sendFile(fileDirectory, {
    root: ".",
  });
});

export default router;
