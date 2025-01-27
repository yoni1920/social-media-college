import { hash } from "bcrypt";
import commentsService from "../comments/comments.service";
import { BadRequestException } from "../exceptions";
import postsService from "../posts/posts.service";
import {
  USER_PASSWORD_SALT_ROUNDS,
  USER_PICTURE_STORAGE_PATH,
} from "./constants";
import {
  CreateExternalUserDTO,
  CreateUserDTO,
  UpdateUserDTO,
} from "./dto-schema";
import usersRepository from "./users.repository";
import { getDefaultProfilePicture, isExternalUserDTO } from "./utils";
import storageService from "../file-storage/storage.service";
import { serverConfig } from "../config";

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
  userDTO: UpdateUserDTO,
  file?: Express.Multer.File
): Promise<Date | undefined> => {
  const { removePicture, ...otherFields } = userDTO;

  const pictureFileName = removePicture
    ? getDefaultProfilePicture()
    : `${serverConfig.serverUrl}/users/image/${userID}`;

  const user: UpdateUserDTO = {
    ...otherFields,
    picture: pictureFileName,
  };

  const { updatedExisting, updatedAt } = await usersRepository.updateUser(
    userID,
    user
  );

  if (file) {
    await storageService.replaceResourceFile(
      USER_PICTURE_STORAGE_PATH,
      userID,
      file,
      storageService.generateFileName(file)
    );
  }

  if (!updatedExisting) {
    throw new BadRequestException("User to update does not exist", { userID });
  }

  return updatedAt;
};

const createUser = async (userDTO: CreateUserDTO | CreateExternalUserDTO) => {
  if (isExternalUserDTO(userDTO)) {
    return await usersRepository.createUser(userDTO);
  }

  const { password: userPassword, ...otherUserData } = userDTO;

  const password = await hash(userPassword, USER_PASSWORD_SALT_ROUNDS);

  const user: CreateUserDTO = {
    ...otherUserData,
    password,
    picture: getDefaultProfilePicture(),
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
