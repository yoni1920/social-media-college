import { hash } from "bcrypt";
import commentsService from "../comments/comments.service";
import { BadRequestException } from "../exceptions";
import postsService from "../posts/posts.service";
import { USER_PASSWORD_SALT_ROUNDS } from "./constants";
import { CreateUserDTO, UpdateUserDTO } from "./dto-schema";
import usersRepository from "./users.repository";

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

const createUser = async (userDTO: CreateUserDTO) => {
  const { password: userPassword, ...otherUserData } = userDTO;

  const password = await hash(userPassword, USER_PASSWORD_SALT_ROUNDS);

  const user: CreateUserDTO = {
    ...otherUserData,
    password,
  };

  return await usersRepository.createUser(user);
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

const getUserByUsername = async (username: string) => {
  return await usersRepository.getUserByUsername(username);
};

const getUserByEmail = async (email: string) => {
  return await usersRepository.getUserByEmail(email);
};

export default {
  getAllUsers,
  getUserByID,
  getUserByUsername,
  getUserByEmail,
  updateUser,
  createUser,
  deleteUser,
  doesUserExist,
  verifySenderUserExists,
};
