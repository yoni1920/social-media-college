import commentsRepository from "./comments.repository";
import usersService from "../users/users.service";
import postsService from "../posts/posts.service";
import { BadRequestException } from "../exceptions";
import { CreateCommentDTO, UpdateCommentDTO } from "./dto-schema";

const getAllComments = async () => {
  return await commentsRepository.getAllComments();
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

const getCommentsByPostID = async (postID: string) => {
  return await commentsRepository.getCommentsByPostID(postID);
};

const createComment = async (comment: CreateCommentDTO) => {
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
