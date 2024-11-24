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
  const post = await postsRepository.getPostByID(postID);

  if (!post) {
    throw new BadRequestException("Post does not exist", { postID });
  }

  return post;
};

/**
 *
 * @param {string} postID
 * @param {z.infer<typeof updatePostSchema>} post
 * @returns {Promise<Date | undefined>}
 */
const updatePost = async (postID, post) => {
  const { updatedExisting, updatedAt } = await postsRepository.updatePost(
    postID,
    post
  );

  if (!updatedExisting) {
    throw new BadRequestException("Post to update does not exist", { postID });
  }

  return updatedAt;
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
