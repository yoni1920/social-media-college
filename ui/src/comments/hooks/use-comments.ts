import { useCallback } from "react";
import { commentsApi } from "../../api/comments-api";
import { TComment } from "../../types/comment";
import { usePaginatedQuery } from "../../hooks/use-paginated-query";
import { usePaginationQueryParams } from "../../hooks/use-pagination-query-params";

export const useComments = (postId?: string) => {
  const { pageData, setPageData, setPage } = usePaginationQueryParams();
  const fetchByPostID = useCallback(
    (page: number) => {
      return commentsApi.get(
        `/?limit=10&offset=${page * 10}&postID=${postId ?? ""}`
      );
    },
    [postId]
  );

  const {
    isLoading,
    isError,
    data: comments,
  } = usePaginatedQuery<TComment>(fetchByPostID, pageData, setPageData);

  return {
    comments,
    page: pageData.page,
    totalPages: pageData.totalPages,
    isLoading,
    setPage,
    isError,
  };
};
