import postsRepository from "./posts.repository.js";
import { createPostSchema } from "./dto-schema/create-post.dto.js";

const getAllPosts = () => postsRepository.getAllPosts();

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
