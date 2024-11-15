import postsRepository from "./posts.repository.js";
import { createPostSchema } from "./dto-schema/create-post.dto.js";
import { Post } from "./post.model.js";

const getAllPosts = async () => {
  return await postsRepository.getAllPosts();
};

const getPostByID = (postID) => postsRepository.getPostByID(postID);

const updatePost = (postID, post) => postsRepository.updatePost(postID, post);

const getPostBySender = (senderID) => postsRepository.getPostBySender(senderID);

/**
 *
 * @param {z.infer<typeof createPostSchema>} post
 * @returns {Promise<string>} post id
 */
const createPost = async (post) => {
  return await postsRepository.createPost(post);
};

export default {
  getAllPosts,
  getPostByID,
  updatePost,
  getPostBySender,
  createPost,
};
