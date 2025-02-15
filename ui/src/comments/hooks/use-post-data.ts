import { usePostsStore } from "../../store/posts";

export const usePostData = (postId: string) => {
  return usePostsStore().data.find((post) => post._id === postId);
};
