import { useCallback } from "react";
import { commentsApi } from "../../api/comments-api";
import { TComment } from "../../types/comment";
import { usePaginatedQuery } from "../../hooks/usePaginatedQuery";

export const useComments = (postId?: string) => {
  const fetchByPostID = useCallback(
    (page: number) => {
      return commentsApi.get(
        `/?limit=10&offset=${page * 10}&postID=${postId ?? ""}`
      );
    },
    [postId]
  );

  const { data: comments, ...extraData } =
    usePaginatedQuery<TComment>(fetchByPostID);

  return Object.assign(extraData, { comments });
};
