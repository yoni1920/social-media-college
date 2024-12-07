import { CommentModel } from "./comment.model";
import { CreateCommentDTO, UpdateCommentDTO } from "./dto-schema";

const getAllComments = async (): Promise<Comment[]> => {
  return await CommentModel.find({});
};

const getCommentByID = async (commentID: string): Promise<Comment | null> => {
  return await CommentModel.findById(commentID);
};

const getCommentsByPostID = async (postID: string) => {
  return await CommentModel.find({ postID });
};

const updateComment = async (commentID: string, comment: UpdateCommentDTO) => {
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

const createComment = async (commentDTO: CreateCommentDTO) => {
  const comment = new CommentModel(commentDTO);

  return await comment.save();
};

const deleteCommentById = async (commentID: string) => {
  return (await CommentModel.deleteOne({ _id: commentID })).deletedCount > 0;
};

const deleteCommentsByPostIDs = async (postIDs: string[]) => {
  await CommentModel.deleteMany({ postID: { $in: postIDs } });
};

const deleteCommentsBySender = async (sender: string) => {
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
