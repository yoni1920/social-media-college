import { z } from "zod";
import { Comment } from "./comment.model.js";
import { createCommentSchema } from "./dto-schema/create-comment.dto.js";
import { updateCommentSchema } from "./dto-schema/update-comment.dto.js";
import { USER_POPULATE_FIELDS } from "../users/user.model.js";

const getAllComments = async () => {
  return await Comment.find({})
    .populate(USER_POPULATE_FIELDS.field, USER_POPULATE_FIELDS.subFields)
    .exec();
};

/**
 *
 * @param {string} commentID
 */
const getCommentByID = async (commentID) => {
  return await Comment.findById(commentID)
    .populate(USER_POPULATE_FIELDS.field, USER_POPULATE_FIELDS.subFields)
    .exec();
};

/**
 *
 * @param {string} postID
 */
const getCommentsByPostID = async (postID) => {
  return await Comment.find({ postID })
    .populate(USER_POPULATE_FIELDS.field, USER_POPULATE_FIELDS.subFields)
    .select("-postID")
    .exec();
};

/**
 *
 * @param {string} commentID
 * @param {z.infer<typeof updateCommentSchema>} comment
 * @returns {Promise<{ updatedExisting: boolean | undefined, updatedAt: Date | undefined }>}
 */
const updateComment = async (commentID, comment) => {
  const { lastErrorObject, value: updatedPost } =
    await Comment.findByIdAndUpdate(commentID, comment, {
      includeResultMetadata: true,
      new: true,
    });

  return {
    updatedExisting: lastErrorObject?.updatedExisting,
    updatedAt: updatedPost?.updatedAt,
  };
};

/**
 *
 * @param {z.infer<typeof createCommentSchema>} commentDTO
 */
const createComment = async (commentDTO, session) => {
  const comment = new Comment(commentDTO);

  return await comment.save({ session });
};

/**
 *
 * @param {string} commentID
 */
const deleteCommentById = async (commentID) => {
  return (await Comment.deleteOne({ _id: commentID })).deletedCount > 0;
};

/**
 *
 * @param {string[]} postIDs
 */
const deleteCommentsByPostIDs = async (postIDs) => {
  await Comment.deleteMany({ postID: { $in: postIDs } });
};

/**
 *
 * @param {string} sender
 */
const deleteCommentsBySender = async (sender) => {
  await Comment.deleteMany({ sender });
};

export default {
  getAllComments,
  getCommentByID,
  updateComment,
  getCommentsByPostID,
  createComment,
  deleteCommentById,
  deleteCommentsByPostIDs,
  deleteCommentsBySender,
};
