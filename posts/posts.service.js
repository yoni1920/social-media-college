import postsRepository from "./posts.repository.js";
import { createPostSchema } from "./dto-schema/create-post.dto.js";
import { updatePostSchema } from "./dto-schema/update-post.dto.js";

const getAllPosts = async () => {
  return await postsRepository.getAllPosts();
};

/**
 *
 * @param {string} postID
 */
const getPostByID = async (postID) => {
  return await postsRepository.getPostByID(postID);
};

/**
 *
 * @param {string} postID
 * @param {z.infer<typeof updatePostSchema>} post
 * @returns {Promise<{ updatedExisting: boolean | undefined, updatedAt: Date | undefined }>}
 */
const updatePost = async (postID, post) => {
  return await postsRepository.updatePost(postID, post);
};

/**
 *
 * @param {string} sender
 */
const getPostsBySender = async (sender) => {
  return await postsRepository.getPostsBySender(sender);
};

/**
 *
 * @param {z.infer<typeof createPostSchema>} post
 */
const createPost = async (post) => {
  const { id, createdAt } = await postsRepository.createPost(post);

  return {
    id,
    createdAt,
  };
};

export default {
  getAllPosts,
  getPostByID,
  updatePost,
  getPostsBySender,
  createPost,
};
