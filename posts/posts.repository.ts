import { UpdateResourceReturn } from "../types/update-resource-return";
import { USER_POPULATE_FIELDS } from "../users/user.model";
import { CreatePostDTO, UpdatePostDTO } from "./dto-schema";
import { Post, PostModel } from "./post.model";

const getAllPosts = async (): Promise<Post[]> => {
  return await PostModel.find({})
    .populate(USER_POPULATE_FIELDS.field, USER_POPULATE_FIELDS.subFields)
    .exec();
};

const getPostByID = async (postID: string): Promise<Post | null> => {
  return await PostModel.findById(postID)
    .populate(USER_POPULATE_FIELDS.field, USER_POPULATE_FIELDS.subFields)
    .exec();
};

const updatePost = async (
  postID: string,
  post: UpdatePostDTO
): Promise<UpdateResourceReturn> => {
  const { lastErrorObject, value: updatedPost } =
    await PostModel.findByIdAndUpdate(postID, post, {
      includeResultMetadata: true,
      new: true,
    });

  return {
    updatedExisting: lastErrorObject?.updatedExisting,
    updatedAt: updatedPost?.updatedAt,
  };
};

const getPostsBySenderID = async (senderID: string): Promise<Post[]> => {
  return await PostModel.find({ sender: senderID })
    .populate(USER_POPULATE_FIELDS.field, USER_POPULATE_FIELDS.subFields)
    .exec();
};

const getPostIDsBySenderID = async (senderID: string): Promise<string[]> => {
  const idsResult = await PostModel.find({ sender: senderID }).select({
    postID: 1,
  });

  return idsResult.map(({ _id: postID }) => postID);
};

const createPost = async (postDTO: CreatePostDTO) => {
  const post = new PostModel(postDTO);

  return await post.save();
};

const deletePostsByIDs = async (postIDs: string[]) => {
  return (
    (await PostModel.deleteMany({ _id: { $in: postIDs } })).deletedCount > 0
  );
};

const doesPostExist = async (postID: string) => {
  return await PostModel.exists({ _id: postID });
};

const deletePostsBySender = async (senderID: string) => {
  await PostModel.deleteMany({ sender: senderID });
};

export default {
  getAllPosts,
  getPostByID,
  updatePost,
  getPostsBySenderID,
  createPost,
  deletePostsByIDs,
  doesPostExist,
  deletePostsBySender,
  getPostIDsBySenderID,
};
