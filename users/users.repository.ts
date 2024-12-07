import { User, UserModel } from "./user.model";
import { handleDuplicateKeyException } from "../utils/mongodb-exceptions";
import { UpdateResourceReturn } from "../types/update-resource-return.js";
import { CreateUserDTO, UpdateUserDTO } from "./dto-schema";

const getAllUsers = async (): Promise<User[]> => {
  return await UserModel.find({});
};

const getUserByID = async (userID: string): Promise<User | null> => {
  return await UserModel.findById(userID);
};

const updateUser = async (
  userID: string,
  user: UpdateUserDTO
): Promise<UpdateResourceReturn> => {
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

/**
 *
 * @param {z.infer<typeof createUserSchema>} userDTO
 */
const createUser = async (userDTO: CreateUserDTO) => {
  const user = new UserModel(userDTO);

  return await user.save().catch((err) => handleDuplicateKeyException(err));
};

const deleteUserById = async (userID: string) => {
  return (await UserModel.deleteOne({ _id: userID })).deletedCount > 0;
};

const doesUserExist = async (userID: string) => {
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
