import { z } from "zod";
import { Post } from "./post.model.js";
import { createPostSchema } from "./dto-schema/create-post.dto.js";
import { updatePostSchema } from "./dto-schema/update-post.dto.js";
import { USER_POPULATE_FIELDS } from "../users/user.model.js";

const getAllPosts = async () => {
  return await Post.find({})
    .populate(USER_POPULATE_FIELDS.field, USER_POPULATE_FIELDS.subFields)
    .exec();
};

/**
 *
 * @param {string} postID
 */
const getPostByID = async (postID) => {
  return await Post.findById(postID)
    .populate(USER_POPULATE_FIELDS.field, USER_POPULATE_FIELDS.subFields)
    .exec();
};

/**
 *
 * @param {string} postID
 * @param {z.infer<typeof updatePostSchema>} post
 * @returns {Promise<{ updatedExisting: boolean | undefined, updatedAt: Date | undefined }>}
 */
const updatePost = async (postID, post) => {
  const { lastErrorObject, value: updatedPost } = await Post.findByIdAndUpdate(
    postID,
    post,
    {
      includeResultMetadata: true,
      new: true,
    }
  );

  return {
    updatedExisting: lastErrorObject?.updatedExisting,
    updatedAt: updatedPost?.updatedAt,
  };
};

/**
 *
 * @param {string} senderID
 */
const getPostsBySenderID = async (senderID) => {
  return await Post.find({ sender: senderID })
    .populate(USER_POPULATE_FIELDS.field, USER_POPULATE_FIELDS.subFields)
    .exec();
};

/**
 *
 * @param {string} senderID
 * @returns {Promise<string[]>} postIDs
 */
const getPostIDsBySenderID = async (senderID) => {
  const idsResult = await Post.find({ sender: senderID }).select({ postID: 1 });

  return idsResult.map(({ _id: postID }) => postID);
};

/**
 *
 * @param {z.infer<typeof createPostSchema>} postDTO
 */
const createPost = async (postDTO) => {
  const post = new Post(postDTO);

  return await post.save();
};

/**
 *
 * @param {string} postIDs
 */
const deletePostsByIDs = async (postIDs) => {
  return (await Post.deleteMany({ _id: { $in: postIDs } })).deletedCount > 0;
};

const doesPostExist = async (postID) => {
  return await Post.exists({ _id: postID });
};

/**
 *
 * @param {string} sender
 */
const deletePostsBySender = async (sender) => {
  await Post.deleteMany({ sender });
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
