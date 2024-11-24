import { z } from "zod";
import { User } from "./user.model.js";
import { createUserSchema } from "./dto-schema/create-user.dto.js";
import { updateUserSchema } from "./dto-schema/update-user.dto.js";
import { handleDuplicateKeyException } from "../utils/mongodb-exceptions.js";

const getAllUsers = async () => {
  return await User.find({});
};

/**
 *
 * @param {string} userID
 */
const getUserByID = async (userID) => {
  return await User.findById(userID);
};

/**
 *
 * @param {string} userID
 * @param {z.infer<typeof updateUserSchema>} user
 * @returns {Promise<{ updatedExisting: boolean | undefined, updatedAt: Date | undefined }>}
 */
const updateUser = async (userID, user) => {
  const { lastErrorObject, value: updatedPost } = await User.findByIdAndUpdate(
    userID,
    user,
    {
      includeResultMetadata: true,
      new: true,
    }
  ).catch((err) => handleDuplicateKeyException(err));

  return {
    updatedExisting: lastErrorObject?.updatedExisting,
    updatedAt: updatedPost?.updatedAt,
  };
};

/**
 *
 * @param {z.infer<typeof createUserSchema>} userDTO
 */
const createUser = async (userDTO) => {
  const user = new User(userDTO);

  return await user.save().catch((err) => handleDuplicateKeyException(err));
};

/**
 *
 * @param {string} userID
 */
// TODO deletes all posts, comments in transaction
const deleteUserById = async (userID) => {
  return (await User.deleteOne({ _id: userID })).deletedCount > 0;
};

const doesUserExist = async (userID) => {
  return await User.exists({ _id: userID });
};

export default {
  getAllUsers,
  getUserByID,
  updateUser,
  createUser,
  deleteUserById,
  doesUserExist,
};
