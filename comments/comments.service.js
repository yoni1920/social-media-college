import commentsRepository from "./comments.repository.js";
import { createCommentSchema } from "./dto-schema/create-comment.dto.js";
import { updateCommentSchema } from "./dto-schema/update-comment.dto.js";
import usersService from "../users/users.service.js";
import postsService from "../posts/posts.service.js";

const getAllComments = async () => {
  return await commentsRepository.getAllComments();
};

/**
 *
 * @param {string} commentID
 */
const getCommentByID = async (commentID) => {
  const comment = await commentsRepository.getCommentByID(commentID);

  if (!comment) {
    throw new BadRequestException("Comment does not exist", { comment });
  }

  return comment;
};

/**
 *
 * @param {string} commentID
 * @param {z.infer<typeof updateCommentSchema>} comment
 * @returns {Promise<Date | undefined>}
 */
const updateComment = async (commentID, comment) => {
  const { updatedExisting, updatedAt } = await commentsRepository.updateComment(
    commentID,
    comment
  );

  if (!updatedExisting) {
    throw new BadRequestException("Comment to update does not exist", {
      commentID,
    });
  }

  return updatedAt;
};

/**
 *
 * @param {string} postID
 */
const getCommentsByPostID = async (postID) => {
  return await commentsRepository.getCommentsByPostID(postID);
};

/**
 *
 * @param {z.infer<typeof createCommentSchema>} commentDTO
 */
const createComment = async (comment) => {
  await Promise.all([
    usersService.verifySenderUserExists(comment.sender),
    postsService.verifyPostExists(comment.postID),
  ]);

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
  return await commentsRepository.deleteCommentById(commentID);
};

/**
 *
 * @param {string[]} postIDs
 */
const deleteCommentsByPostIDs = async (...postIDs) => {
  await commentsRepository.deleteCommentsByPostIDs(postIDs);
};

/**
 *
 * @param {string} sender
 */
const deleteCommentsBySender = async (sender) => {
  await commentsRepository.deleteCommentsBySender(sender);
};

export default {
  getAllComments,
  getCommentByID,
  updateComment,
  getCommentsByPostID,
  createComment,
  deleteComment,
  deleteCommentsByPostIDs,
  deleteCommentsBySender,
};
