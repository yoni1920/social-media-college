import { z } from "zod";
import { Post } from "./post.model.js";
import { createPostSchema } from "./dto-schema/create-post.dto.js";

const getAllPosts = async () => {
  return await Post.find({});
};

const getPostByID = (postID) => ({});

const updatePost = (postID, post) => ({});

const getPostBySender = (senderID) => ({});

/**
 *
 * @param {z.infer<typeof createPostSchema>} postDTO
 * @returns {Promise<string>} post id
 */
const createPost = async (postDTO) => {
  const post = new Post(postDTO);

  const { id } = await post.save();

  return id;
};

export default {
  getAllPosts,
  getPostByID,
  updatePost,
  getPostBySender,
  createPost,
};
