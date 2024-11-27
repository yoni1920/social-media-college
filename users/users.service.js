import usersRepository from "./users.repository.js";
import { createUserSchema } from "./dto-schema/create-user.dto.js";
import { updateUserSchema } from "./dto-schema/update-user.dto.js";
import { BadRequestException } from "../exceptions/bad-request-exception.js";
import postsService from "../posts/posts.service.js";
import commentsService from "../comments/comments.service.js";

const getAllUsers = async () => {
  return await usersRepository.getAllUsers();
};

/**
 *
 * @param {string} userID
 */
const getUserByID = async (userID) => {
  const user = await usersRepository.getUserByID(userID);

  if (!user) {
    throw new BadRequestException("User does not exist", { userID });
  }

  return user;
};

/**
 *
 * @param {string} userID
 * @param {z.infer<typeof updateUserSchema>} user
 * @returns {Promise<Date | undefined>}
 */
const updateUser = async (userID, user) => {
  const { updatedExisting, updatedAt } = await usersRepository.updateUser(
    userID,
    user
  );

  if (!updatedExisting) {
    throw new BadRequestException("User to update does not exist", { userID });
  }

  return updatedAt;
};

/**
 *
 * @param {z.infer<typeof createUserSchema>} user
 */
const createUser = async (user) => {
  const { id, createdAt } = await usersRepository.createUser(user);

  return {
    id,
    createdAt,
  };
};

/**
 *
 * @param {string} userID
 */
const deleteUser = async (userID) => {
  const userExists = await usersRepository.doesUserExist(userID);

  if (!userExists) {
    return false;
  }

  const postsToDelete = await postsService.getPostIDsBySenderID(userID);

  await Promise.all([
    commentsService.deleteCommentsBySender(userID),
    postsService.deletePost(...postsToDelete),
    usersRepository.deleteUserById(userID),
  ]);

  return true;
};

/**
 *
 * @param {string} userID
 */
const doesUserExist = async (userID) => {
  return await usersRepository.doesUserExist(userID);
};

/**
 *
 * @param {string} sender
 */
const verifySenderUserExists = async (sender) => {
  const userResult = await doesUserExist(sender);

  if (!userResult) {
    throw new BadRequestException("Sender does not exist", {
      sender,
    });
  }
};

export default {
  getAllUsers,
  getUserByID,
  updateUser,
  createUser,
  deleteUser,
  doesUserExist,
  verifySenderUserExists,
};
