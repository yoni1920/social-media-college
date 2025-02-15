import { TPost } from "../../types/post";
import { postsApi } from "../../api/posts-api";
import { useCallback } from "react";
import { PageData, usePaginatedQuery } from "../../hooks/use-paginated-query";
import { usePostsStore } from "../../store/posts";

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

  const {
    page,
    totalPages,
    setPageData,
    setPage,
    data: posts,
  } = usePostsStore();

  const { isLoading, isError, refresh } = usePaginatedQuery<TPost>(
    fetchBySenderId,
    { page, totalPages },
    setPageData
  );

  return { posts, isLoading, isError, setPage, page, totalPages, refresh };
};
