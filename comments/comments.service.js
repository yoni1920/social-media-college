import commentsRepository from "./comments.repository.js";
import { createCommentSchema } from "./dto-schema/create-comment.dto.js";
import { updateCommentSchema } from "./dto-schema/update-comment.dto.js";

const getAllComments = async () => {
  return await commentsRepository.getAllComments();
};

/**
 *
 * @param {string} commentID
 */
const getCommentByID = async (commentID) => {
  return await commentsRepository.getCommentByID(commentID);
};

/**
 *
 * @param {string} commentID
 * @param {z.infer<typeof updateCommentSchema>} comment
 * @returns {Promise<{ updatedExisting: boolean | undefined, updatedAt: Date | undefined }>}
 */
const updateComment = async (postID, comment) => {
  return await commentsRepository.updateComment(postID, comment);
};

/**
 *
 * @param {string} postID
 */
const getCommentsByPostID = async (postID) => {
  return await commentsRepository.getCommentByPostID(postID);
};

/**
 *
 * @param {z.infer<typeof createCommentSchema>} comment
 */
const createComment = async (comment) => {
  const { id, createdAt } = await commentsRepository.createComment(comment);

  return {
    id,
    createdAt,
  };
};

/**
 *
 * @param {string} commentID
 */
const deleteComment = async (commentID) => {
  return commentsRepository.deleteCommentById(commentID);
};

export default {
  getAllComments,
  getCommentByID,
  updateComment,
  getCommentsByPostID,
  createComment,
  deleteComment,
};
