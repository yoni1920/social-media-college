import { commentsMetadata } from "../../comments/comment.model";
import {
  ResourceExistsResult,
  UpdateResourceResult,
} from "../../types/resources";
import { USER_POPULATE_FIELDS } from "../../users/user.model";
import { CreatePostDTO, UpdatePostDTO } from "../dto-schema";
import { LIKES_POPULATION } from "../models/like.model";
import { PaginatedPostsResult, Post, PostModel } from "../models/post.model";

const getAllPosts = async (
  limit: number,
  offset: number
): Promise<PaginatedPostsResult> => {
  return await PostModel.paginate(
    {},
    {
      sort: { _updatedAt: -1 },
      limit,
      offset,
      populate: [
        {
          path: USER_POPULATE_FIELDS.field,
          select: USER_POPULATE_FIELDS.subFields,
        },
        LIKES_POPULATION,
        { path: commentsMetadata.virtualFields.NUM_COMMENTS },
      ],
    }
  );
};

const getPostByID = async (postID: string): Promise<Post | null> => {
  return await PostModel.findById(postID)
    .populate(USER_POPULATE_FIELDS.field, USER_POPULATE_FIELDS.subFields)
    .populate(LIKES_POPULATION)
    .populate(commentsMetadata.virtualFields.NUM_COMMENTS)
    .exec();
};

const updatePost = async (
  postID: string,
  post: UpdatePostDTO
): Promise<UpdateResourceResult> => {
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

const getPostsBySenderID = async (
  senderID: string,
  limit: number,
  offset: number
): Promise<PaginatedPostsResult> => {
  return await PostModel.paginate(
    { sender: senderID },
    {
      limit,
      offset,
      sort: { _updatedAt: -1 },
      populate: [
        {
          path: USER_POPULATE_FIELDS.field,
          select: USER_POPULATE_FIELDS.subFields,
        },
        LIKES_POPULATION,
        { path: commentsMetadata.virtualFields.NUM_COMMENTS },
      ],
    }
  );
};

const getPostIDsBySenderID = async (senderID: string): Promise<string[]> => {
  const idsResult = await PostModel.find({ sender: senderID }).select({
    postID: 1,
  });

  return idsResult.map(({ _id: postID }) => postID) as string[];
};

const createPost = async (postDTO: CreatePostDTO): Promise<Post> => {
  const post = new PostModel(postDTO);

  return await post.save();
};

const deletePostsByIDs = async (postIDs: string[]): Promise<boolean> => {
  return (
    (await PostModel.deleteMany({ _id: { $in: postIDs } })).deletedCount > 0
  );
};

const doesPostExist = async (postID: string): Promise<ResourceExistsResult> => {
  return await PostModel.exists({ _id: postID });
};

const deletePostsBySender = async (senderID: string): Promise<void> => {
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
