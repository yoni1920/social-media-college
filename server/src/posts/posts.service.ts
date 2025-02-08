import postsRepository from "./posts.repository";
import { BadRequestException } from "../exceptions";
import usersService from "../users/users.service";
import commentsService from "../comments/comments.service";
import { Post } from "./post.model";
import {
  CreatePostDTO,
  POSTS_DISK_STORAGE_PATH,
  UpdatePostDTO,
} from "./dto-schema";
import storageService from "../file-storage/storage.service";

const getAllPosts = async (): Promise<Post[]> => {
  return await postsRepository.getAllPosts();
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

const getPostsBySenderID = async (senderID: string): Promise<Post[]> => {
  const senderResult = await usersService.doesUserExist(senderID);

  if (!senderResult) {
    return [];
  }

  return await postsRepository.getPostsBySenderID(senderID);
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
  await commentsService.deleteCommentsByPostIDs(...postIDs);
  await storageService.deleteFilesByIds(POSTS_DISK_STORAGE_PATH, postIDs);

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

export default {
  getAllPosts,
  getPostByID,
  updatePost,
  getPostsBySenderID,
  createPost,
  deletePost,
  verifyPostExists,
  getPostIDsBySenderID,
};
