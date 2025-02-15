import { TPost } from "../../types/post";
import { postsApi } from "../../api/posts-api";
import { useCallback } from "react";
import { usePaginatedQuery } from "../../hooks/usePaginatedQuery";

const POSTS_PAGE_LIMIT = 20;

export const usePosts = (profileId?: string) => {
  const fetchBySenderId = useCallback(
    (page: number) =>
      postsApi.get(
        `?limit=${POSTS_PAGE_LIMIT}&offset=${page * POSTS_PAGE_LIMIT}${
          profileId ? `&senderID=${profileId}` : ""
        }`
      ),
    [profileId]
  );

  const { data: posts, ...extraData } =
    usePaginatedQuery<TPost>(fetchBySenderId);

  return { posts, ...extraData };
};
