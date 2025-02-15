import { PaginateResult } from "mongoose";
import commentsService from "../comments/comments.service";
import { BadRequestException } from "../exceptions";
import storageService from "../file-storage/storage.service";
import usersService from "../users/users.service";
import {
  CreatePostDTO,
  POSTS_DISK_STORAGE_PATH,
  UpdatePostDTO,
} from "./dto-schema";
import likesRepository from "./likes.repository";
import { PaginatedPostsResult, Post } from "./models/post.model";
import postsRepository from "./posts.repository";

const getAllPosts = async (
  limit: number = 50,
  offset: number = 0
): Promise<PaginatedPostsResult> => {
  return await postsRepository.getAllPosts(limit, offset);
};

const getPostByID = async (postID: string): Promise<Post> => {
  const post = await postsRepository.getPostByID(postID);

  if (!post) {
    throw new BadRequestException("Post does not exist", { postID });
  }

  return post;
};

const updatePost = async (
  postID: string,
  post: UpdatePostDTO,
  file?: Express.Multer.File
): Promise<Date | undefined> => {
  if (post.fileName || file) {
    post.fileName ??= storageService.generateFileName(file);
  }

  const { updatedExisting, updatedAt } = await postsRepository.updatePost(
    postID,
    post
  );

  if (file) {
    await storageService.replaceResourceFile(
      POSTS_DISK_STORAGE_PATH,
      postID,
      file,
      post.fileName
    );
  }

  if (!updatedExisting) {
    throw new BadRequestException("Post to update does not exist", { postID });
  }

  return updatedAt;
};

const getPostsBySenderID = async (
  senderID: string,
  limit: number = 50,
  offset: number = 0
): Promise<PaginatedPostsResult> => {
  const senderResult = await usersService.doesUserExist(senderID);

  if (!senderResult) {
    return { docs: [], totalPages: 0, page: 1 };
  }

  return await postsRepository.getPostsBySenderID(senderID, limit, offset);
};

const getPostIDsBySenderID = async (senderID: string): Promise<string[]> => {
  return await postsRepository.getPostIDsBySenderID(senderID);
};

const createPost = async (post: CreatePostDTO, file: Express.Multer.File) => {
  await usersService.verifySenderUserExists(post.sender);

  post.fileName = storageService.generateFileName(file);
  const { _id: id, createdAt } = await postsRepository.createPost(post);

  await storageService.saveResourceFile(
    POSTS_DISK_STORAGE_PATH,
    id,
    file,
    post.fileName
  );

  return {
    id,
    createdAt,
  };
};

const deletePost = async (...postIDs: string[]) => {
  await Promise.all([
    commentsService.deleteCommentsByPostIDs(...postIDs),
    storageService.deleteFilesByIds(POSTS_DISK_STORAGE_PATH, postIDs),
    likesRepository.deleteLikesByPostIds(postIDs),
  ]);

  return await postsRepository.deletePostsByIDs(postIDs);
};

const verifyPostExists = async (postID: string) => {
  const postResult = await postsRepository.doesPostExist(postID);

  if (!postResult) {
    throw new BadRequestException("Post does not exist", {
      postID,
    });
  }
};

const deletePostLikesByUser = async (userID: string) => {
  await likesRepository.deleteLikesByUserID(userID);
};

const likePost = async (postID: string, userID: string) => {
  await likesRepository.addLike(postID, userID);
};

const unlikePost = async (postID: string, userID: string) => {
  await likesRepository.removeLike(postID, userID);
};

export default {
  getAllPosts,
  getPostByID,
  updatePost,
  getPostsBySenderID,
  createPost,
  deletePost,
  verifyPostExists,
  getPostIDsBySenderID,
  deletePostLikesByUser,
  likePost,
  unlikePost,
};
