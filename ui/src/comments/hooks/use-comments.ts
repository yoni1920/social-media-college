import { useCallback } from "react";
import { commentsApi } from "../../api/comments-api";
import { TComment } from "../../types/comment";
import { usePaginatedQuery } from "../../hooks/usePaginatedQuery";

export const useComments = (postId?: string) => {
  const fetchByPostID = useCallback(() => {
    return commentsApi.get(`/?postID=${postId ?? ""}`);
  }, [postId]);

  const {
    data: comments,
    isLoading,
    refresh,
    fetchNextPage,
  } = usePaginatedQuery<TComment>(fetchByPostID);

  return { comments, isLoading, refresh, fetchNextPage };
};
