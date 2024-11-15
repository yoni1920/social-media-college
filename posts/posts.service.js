import postsRepository from "./posts.repository.js";
import { createPostSchema } from "./dto-schema/create-post.dto.js";

const getAllPosts = async () => {
  return await postsRepository.getAllPosts();
};

const getPostByID = (postID) => postsRepository.getPostByID(postID);

const updatePost = (postID, post) => postsRepository.updatePost(postID, post);

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
