import postsRepository from "../repositories/posts-repository.js";

const getAllPosts = () => postsRepository.getAllPosts();

const getPostByID = (postID) => postsRepository.getPostByID(postID);

const updatePost = (postID, post) => postsRepository.updatePost(postID, post);

const getPostBySender = (senderID) => postsRepository.getPostBySender(senderID);

const createPost = (post) => postsRepository.createPost(post);

export default {
  getAllPosts,
  getPostByID,
  updatePost,
  getPostBySender,
  createPost,
};
