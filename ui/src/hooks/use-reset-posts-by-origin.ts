import { useEffect } from "react";
import { usePostsStore, PostsOrigin } from "../store/posts";

export const useResetPostsByOrigin = (origin: PostsOrigin) => {
  const { origin: currentOrigin, resetPosts } = usePostsStore();

  useEffect(() => {
    if (currentOrigin !== origin) resetPosts(origin);
  }, [origin, currentOrigin]);
};
