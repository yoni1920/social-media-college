import { z } from "zod";
import { Post } from "./post.model.js";
import { createPostSchema } from "./dto-schema/create-post.dto.js";
import { updatePostSchema } from "./dto-schema/update-post.dto.js";

const getAllPosts = async () => {
  return await Post.find({});
};

/**
 *
 * @param {string} postID
 */
const getPostByID = async (postID) => {
  return await Post.findById(postID);
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
 * @param {string} sender
 */
const getPostsBySender = async (sender) => {
  return await Post.find({ sender });
};

/**
 *
 * @param {z.infer<typeof createPostSchema>} postDTO
 */
const createPost = async (postDTO) => {
  const post = new Post(postDTO);

  return await post.save();
};

export default {
  getAllPosts,
  getPostByID,
  updatePost,
  getPostsBySender,
  createPost,
};
