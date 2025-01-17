import { User, USER_FIELDS_WITHOUT_SENSITIVE, UserModel } from "./user.model";
import { handleDuplicateKeyException } from "../utils/mongodb-exceptions";
import {
  CreateGoogleUserDTO,
  CreateUserDTO,
  UpdateUserDTO,
} from "./dto-schema";
import { ResourceExistsResult, UpdateResourceResult } from "../types/resources";
import { UserReturnDTO } from "./dto-schema/user-return-dto";

const getAllUsers = async (): Promise<User[]> => {
  return await UserModel.find({}).select(USER_FIELDS_WITHOUT_SENSITIVE);
};

const getUserByID = async (userID: string): Promise<User | undefined> => {
  return (
    await UserModel.findById(userID).select(USER_FIELDS_WITHOUT_SENSITIVE)
  )?.toObject();
};

const getUserByUsername = async (
  username: string
): Promise<User | undefined> => {
  return (await UserModel.findOne({ username }))?.toObject();
};

const getUserByEmail = async (email: string): Promise<User | undefined> => {
  return (await UserModel.findOne({ email }))?.toObject();
};

const updateUser = async (
  userID: string,
  user: UpdateUserDTO
): Promise<UpdateResourceResult> => {
  const { lastErrorObject, value: updatedUser } =
    await UserModel.findByIdAndUpdate(userID, user, {
      includeResultMetadata: true,
      new: true,
    }).catch((err) => handleDuplicateKeyException(err));

  return {
    updatedExisting: lastErrorObject?.updatedExisting,
    updatedAt: updatedUser?.updatedAt,
  };
};

const createUser = async (
  userDTO: CreateUserDTO | CreateGoogleUserDTO
): Promise<UserReturnDTO> => {
  const user = new UserModel(userDTO);

  const newUser = (
    await user.save().catch((err) => handleDuplicateKeyException(err))
  ).toObject();

  return convertToUserReturnDTO(newUser);
};

const deleteUserById = async (userID: string): Promise<boolean> => {
  return (await UserModel.deleteOne({ _id: userID })).deletedCount > 0;
};

const doesUserExist = async (userID: string): Promise<ResourceExistsResult> => {
  return await UserModel.exists({ _id: userID });
};

const convertToUserReturnDTO = ({
  password,
  googleId,
  ...otherUserFields
}: User): UserReturnDTO => ({ ...otherUserFields });

export default {
  getAllUsers,
  getUserByID,
  getUserByUsername,
  getUserByEmail,
  updateUser,
  createUser,
  deleteUserById,
  doesUserExist,
};
