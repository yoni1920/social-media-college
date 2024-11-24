import { z } from "zod";
import { Post } from "./post.model.js";
import { createPostSchema } from "./dto-schema/create-post.dto.js";
import { updatePostSchema } from "./dto-schema/update-post.dto.js";

const USER_INJECT_FIELDS = {
  field: "sender",
  subFields: ["username"],
};

const getAllPosts = async () => {
  return await Post.find({})
    .populate(USER_INJECT_FIELDS.field, USER_INJECT_FIELDS.subFields)
    .exec();
};

/**
 *
 * @param {string} postID
 */
const getPostByID = async (postID) => {
  return await Post.findById(postID)
    .populate(USER_INJECT_FIELDS.field, USER_INJECT_FIELDS.subFields)
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
    .populate(USER_INJECT_FIELDS.field, USER_INJECT_FIELDS.subFields)
    .exec();
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
 * @param {string} postID
 */
// TODO: delete all post comments
const deletePostByID = async (postID) => {
  return (await Post.deleteOne({ _id: postID })).deletedCount > 0;
};

export default {
  getAllPosts,
  getPostByID,
  updatePost,
  getPostsBySenderID,
  createPost,
  deletePostByID,
};
