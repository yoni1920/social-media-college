import postsRepository from "./posts.repository.js";
import usersRepository from "../users/users.repository.js";
import { createPostSchema } from "./dto-schema/create-post.dto.js";
import { updatePostSchema } from "./dto-schema/update-post.dto.js";
import { BadRequestException } from "../exceptions/bad-request-exception.js";
import { Document } from "mongoose";
import { Post } from "./post.model.js";

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
  const senderResult = doesPostSenderExist(senderID);

  if (!senderResult) {
    return [];
  }

  return await postsRepository.getPostsBySenderID(senderID);
};

/**
 *
 * @param {string} senderID
 * @returns {Promise<boolean>} If post sender exists
 */
const doesPostSenderExist = async (senderID) => {
  return Boolean(await usersRepository.doesUserExist(senderID));
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

/**
 *
 * @param {Document<Post>} post
 */
export const verifyCreatePostSender = async ({ sender }) => {
  console.log(sender);
  const senderResult = await doesPostSenderExist(sender);

  if (!senderResult) {
    throw new BadRequestException("Sender does not exist", {
      sender,
    });
  }
};

/**
 *
 * @param {string} postID
 */
const deletePost = async (postID) => {
  return await postsRepository.deletePostByID(postID);
};

export default {
  getAllPosts,
  getPostByID,
  updatePost,
  getPostsBySenderID,
  createPost,
  deletePost,
};
