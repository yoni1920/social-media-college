import { z } from "zod";
import { Comment } from "./comment.model.js";
import { createCommentSchema } from "./dto-schema/create-comment.dto.js";
import { updateCommentSchema } from "./dto-schema/update-comment.dto.js";

const getAllComments = async () => {
  return await Comment.find({});
};

/**
 *
 * @param {string} commentID
 */
const getCommentByID = async (commentID) => {
  return await Comment.findById(commentID);
};

/**
 *
 * @param {string} postID
 */
const getCommentByPostID = async (postID) => {
  return await Comment.find({ postID });
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
const createComment = async (commentDTO) => {
  const comment = new Comment(commentDTO);

  return await comment.save();
};

/**
 *
 * @param {string} commentID
 */
const deleteCommentById = async (commentID) => {
  return (await Comment.deleteOne({ _id: commentID })).deletedCount > 0;
};

export default {
  getAllComments,
  getCommentByID,
  updateComment,
  getCommentByPostID,
  createComment,
  deleteCommentById,
};
