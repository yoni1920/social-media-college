import postsRepository from "./posts.repository";
import { BadRequestException } from "../exceptions";
import usersService from "../users/users.service";
import commentsService from "../comments/comments.service";
import { Post } from "./post.model";
import { CreatePostDTO, UpdatePostDTO } from "./dto-schema";

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
  post: UpdatePostDTO
): Promise<Date | undefined> => {
  const { updatedExisting, updatedAt } = await postsRepository.updatePost(
    postID,
    post
  );

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

const createPost = async (post: CreatePostDTO) => {
  await usersService.verifySenderUserExists(post.sender);

  const { id, createdAt } = await postsRepository.createPost(post);

  return {
    id,
    createdAt,
  };
};

const deletePost = async (...postIDs: string[]) => {
  await commentsService.deleteCommentsByPostIDs(...postIDs);

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

const deletePostsBySender = async (senderID: string) => {
  await postsRepository.deletePostsBySender(senderID);
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
