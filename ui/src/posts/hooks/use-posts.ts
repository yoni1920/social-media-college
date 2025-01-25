import { TPost } from "../../types/post";
import { postsApi } from "../../api/posts-api";
import { usePaginatedQuery } from "../../hooks/usePaginatedQuery";
import { useCallback } from "react";

export const usePosts = (profileId?: string) => {
  const fetchBySenderId = useCallback(
    () => postsApi.get(`/${profileId ? `?senderID=${profileId}` : ""}`),
    [profileId]
  );
  const { data: posts, ...extraData } =
    usePaginatedQuery<TPost[]>(fetchBySenderId);

  return { posts, ...extraData };
};
