import { TPost } from "../../types/post";
import { postsApi } from "../../api/posts-api";
import { useCallback } from "react";
import { usePaginatedQuery } from "../../hooks/usePaginatedQuery";

export const usePosts = (profileId?: string) => {
  const fetchBySenderId = useCallback(
    () => postsApi.get(`/${profileId ? `?senderID=${profileId}` : ""}`),
    [profileId]
  );

  const { data: posts, ...extraData } =
    usePaginatedQuery<TPost>(fetchBySenderId);

  return { posts, ...extraData };
};
