import { useCallback, useState } from "react";
import { commentsApi } from "../../api/comments-api";
import { TComment } from "../../types/comment";
import { PageData, usePaginatedQuery } from "../../hooks/use-paginated-query";

export const useComments = (postId?: string) => {
  const [pageData, setPageData] = useState<PageData<TComment>>({
    data: [],
    page: 1,
    totalPages: 1,
  });
  const fetchByPostID = useCallback(
    (page: number) => {
      return commentsApi.get(
        `/?limit=10&offset=${page * 10}&postID=${postId ?? ""}`
      );
    },
    [postId]
  );

  const setPage = (page: number) =>
    setPageData((pageData) => ({ ...pageData, page }));

  const { isLoading, isError } = usePaginatedQuery<TComment>(
    fetchByPostID,
    pageData,
    setPageData
  );

  return {
    comments: pageData.data,
    page: pageData.page,
    totalPages: pageData.totalPages,
    isLoading,
    setPage,
    isError,
  };
};
