import usersRepository from "./users.repository";
import { BadRequestException } from "../exceptions";
import postsService from "../posts/posts.service";
import commentsService from "../comments/comments.service";
import { CreateUserDTO, UpdateUserDTO } from "./dto-schema";

const getAllUsers = async () => {
  return await usersRepository.getAllUsers();
};

const getUserByID = async (userID: string) => {
  const user = await usersRepository.getUserByID(userID);

  if (!user) {
    throw new BadRequestException("User does not exist", { userID });
  }

  return user;
};

const updateUser = async (
  userID: string,
  user: UpdateUserDTO
): Promise<Date | undefined> => {
  const { updatedExisting, updatedAt } = await usersRepository.updateUser(
    userID,
    user
  );

  if (!updatedExisting) {
    throw new BadRequestException("User to update does not exist", { userID });
  }

  return updatedAt;
};

const createUser = async (user: CreateUserDTO) => {
  const { id, createdAt } = await usersRepository.createUser(user);

  return {
    id,
    createdAt,
  };
};

const deleteUser = async (userID: string) => {
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

const doesUserExist = async (userID: string) => {
  return await usersRepository.doesUserExist(userID);
};

const verifySenderUserExists = async (sender: string) => {
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
