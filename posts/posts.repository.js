import { z } from "zod";
import { Post } from "./post.model.js";
import { createPostSchema } from "./dto-schema/create-post.dto.js";

const getAllPosts = async () => {
  return await Post.find({});
};

const getPostByID = (postID) => ({});

const updatePost = (postID, post) => ({});

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
