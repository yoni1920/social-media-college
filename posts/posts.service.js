import postsRepository from "./posts.repository.js";
import { createPostSchema } from "./dto-schema/create-post.dto.js";
import { updatePostSchema } from "./dto-schema/update-post.dto.js";
import { BadRequestException } from "../exceptions/bad-request-exception.js";
import usersService from "../users/users.service.js";
import commentsService from "../comments/comments.service.js";

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
 * @param {string} senderID
 */
const getPostsBySenderID = async (senderID) => {
  const senderResult = await usersService.doesUserExist(senderID);

  if (!senderResult) {
    return [];
  }

  return await postsRepository.getPostsBySenderID(senderID);
};

/**
 *
 * @param {string} senderID
 */
const getPostIDsBySenderID = async (senderID) => {
  return await postsRepository.getPostIDsBySenderID(senderID);
};

/**
 *
 * @param {z.infer<typeof createPostSchema>} post
 */
const createPost = async (post) => {
  await usersService.verifySenderUserExists(post.sender);

  const { id, createdAt } = await postsRepository.createPost(post);

  return {
    id,
    createdAt,
  };
};

/**
 *
 * @param {string[]} postIDs
 */
const deletePost = async (...postIDs) => {
  await commentsService.deleteCommentsByPostIDs(...postIDs);

  return await postsRepository.deletePostsByIDs(...postIDs);
};

/**
 *
 * @param {string} postID
 */
const verifyPostExists = async (postID) => {
  const postResult = await postsRepository.doesPostExist(postID);

  if (!postResult) {
    throw new BadRequestException("Post does not exist", {
      postID,
    });
  }
};

/**
 *
 * @param {string} sender
 */
const deletePostsBySender = async (sender) => {
  await postsRepository.deletePostsBySender(sender);
};

export default {
  getAllPosts,
  getPostByID,
  updatePost,
  getPostsBySenderID,
  createPost,
  deletePost,
  verifyPostExists,
  deletePostsBySender,
  getPostIDsBySenderID,
};
