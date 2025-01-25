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
import { rename, rm } from "fs/promises";
import { glob } from "glob";

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
  post.fileName ??= `${Date.now()}.${file?.originalname.split(".").pop()}`;
  const { updatedExisting, updatedAt } = await postsRepository.updatePost(
    postID,
    post
  );

  if (file) {
    await glob(`${POSTS_DISK_STORAGE_PATH}/${postID}-*`).then((files) =>
      Promise.all(
        files.map((fileName) => fileName !== file.path && rm(fileName))
      )
    );
    await rename(
      file.path,
      `${POSTS_DISK_STORAGE_PATH}/${postID}-${post.fileName}`
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
  const extension = file?.originalname.split(".").pop();
  post.fileName = `${Date.now()}.${extension}`;

  const { _id: id, createdAt } = await postsRepository.createPost(post);
  await rename(file.path, `${POSTS_DISK_STORAGE_PATH}/${id}-${post.fileName}`);

  return {
    id,
    createdAt,
  };
};

const deletePost = async (...postIDs: string[]) => {
  await commentsService.deleteCommentsByPostIDs(...postIDs);
  await Promise.all(
    postIDs.map((id) =>
      glob(`${POSTS_DISK_STORAGE_PATH}/${id}-*`).then((files) =>
        Promise.all(files.map((file) => rm(file)))
      )
    )
  );
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
