import commentsRepository from "./comments.repository";
import usersService from "../users/users.service";
import postsService from "../posts/services/posts.service";
import { BadRequestException } from "../exceptions";
import { CreateCommentDTO, UpdateCommentDTO } from "./dto-schema";

const getAllComments = async (limit: number = 50, offset: number = 0) => {
  return await commentsRepository.getAllComments(limit, offset);
};

const getCommentByID = async (commentID: string) => {
  const comment = await commentsRepository.getCommentByID(commentID);

  if (!comment) {
    throw new BadRequestException("Comment does not exist", { comment });
  }

  return comment;
};

const updateComment = async (commentID: string, comment: UpdateCommentDTO) => {
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

const getCommentsByPostID = async (
  postID: string,
  limit: number = 50,
  offset: number = 0
) => {
  return await commentsRepository.getCommentsByPostID(postID, limit, offset);
};

const createComment = async (comment: CreateCommentDTO) => {
  await Promise.all([
    usersService.verifySenderUserExists(comment.sender),
    postsService.verifyPostExists(comment.postID),
  ]);

  const { _id: id, createdAt } = await commentsRepository.createComment(
    comment
  );

  return {
    id,
    createdAt,
  };
};

const deleteComment = async (commentID: string) => {
  return await commentsRepository.deleteCommentById(commentID);
};

const deleteCommentsByPostIDs = async (...postIDs: string[]) => {
  await commentsRepository.deleteCommentsByPostIDs(postIDs);
};

const deleteCommentsBySender = async (sender: string) => {
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
