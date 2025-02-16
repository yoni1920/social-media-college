import { TPost } from "../../types/post";
import { postsApi } from "../../api/posts-api";
import { useCallback } from "react";
import { usePaginatedQuery } from "../../hooks/use-paginated-query";
import { usePaginationQueryParams } from "../../hooks/use-pagination-query-params";

const POSTS_PAGE_LIMIT = 20;

export const usePosts = (profileId?: string) => {
  const { pageData, setPageData, setPage } = usePaginationQueryParams();

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
    data: posts,
    isLoading,
    isError,
    refresh,
  } = usePaginatedQuery<TPost>(fetchBySenderId, pageData, setPageData);

  return { posts, isLoading, isError, setPage, refresh, ...pageData };
};
