import { User, UserModel } from "./user.model";
import { handleDuplicateKeyException } from "../utils/mongodb-exceptions";
import { UpdateResourceResult } from "../types/update-resource-result.js";
import { CreateUserDTO, UpdateUserDTO } from "./dto-schema";
import { ResourceExistsResult } from "../types/resource-exists-result";

const getAllUsers = async (): Promise<User[]> => {
  return await UserModel.find({});
};

const getUserByID = async (userID: string): Promise<User | null> => {
  return await UserModel.findById(userID);
};

const updateUser = async (
  userID: string,
  user: UpdateUserDTO
): Promise<UpdateResourceResult> => {
  const { lastErrorObject, value: updatedPost } =
    await UserModel.findByIdAndUpdate(userID, user, {
      includeResultMetadata: true,
      new: true,
    }).catch((err) => handleDuplicateKeyException(err));

  return {
    updatedExisting: lastErrorObject?.updatedExisting,
    updatedAt: updatedPost?.updatedAt,
  };
};

const createUser = async (userDTO: CreateUserDTO): Promise<User> => {
  const user = new UserModel(userDTO);

  return await user.save().catch((err) => handleDuplicateKeyException(err));
};

const deleteUserById = async (userID: string): Promise<boolean> => {
  return (await UserModel.deleteOne({ _id: userID })).deletedCount > 0;
};

const doesUserExist = async (userID: string): Promise<ResourceExistsResult> => {
  return await UserModel.exists({ _id: userID });
};

export default {
  getAllUsers,
  getUserByID,
  updateUser,
  createUser,
  deleteUserById,
  doesUserExist,
};
