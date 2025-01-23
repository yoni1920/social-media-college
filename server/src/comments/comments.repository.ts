import { UpdateResourceResult } from "../types/resources";
import { Comment, CommentModel } from "./comment.model";
import { CreateCommentDTO, UpdateCommentDTO } from "./dto-schema";

const getAllComments = async (): Promise<Comment[]> => {
  return await CommentModel.find({});
};

const getCommentByID = async (commentID: string): Promise<Comment | null> => {
  return await CommentModel.findById(commentID);
};

const getCommentsByPostID = async (postID: string): Promise<Comment[]> => {
  return await CommentModel.find({ postID });
};

const updateComment = async (
  commentID: string,
  comment: UpdateCommentDTO
): Promise<UpdateResourceResult> => {
  const { lastErrorObject, value: updatedPost } =
    await CommentModel.findByIdAndUpdate(commentID, comment, {
      includeResultMetadata: true,
      new: true,
    });

  return {
    updatedExisting: lastErrorObject?.updatedExisting,
    updatedAt: updatedPost?.updatedAt,
  };
};

const createComment = async (
  commentDTO: CreateCommentDTO
): Promise<Comment> => {
  const comment = new CommentModel(commentDTO);

  return await comment.save();
};

const deleteCommentById = async (commentID: string): Promise<boolean> => {
  return (await CommentModel.deleteOne({ _id: commentID })).deletedCount > 0;
};

const deleteCommentsByPostIDs = async (postIDs: string[]): Promise<void> => {
  await CommentModel.deleteMany({ postID: { $in: postIDs } });
};

const deleteCommentsBySender = async (sender: string): Promise<void> => {
  await CommentModel.deleteMany({ sender });
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
