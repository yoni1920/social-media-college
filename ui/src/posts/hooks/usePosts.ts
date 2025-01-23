import { useEffect, useState } from "react";
import { TPost } from "../../types/post";
import { postsApi } from "../../api/posts-api";

export const usePosts = (profileId?: string) => {
  const [posts, setPosts] = useState<TPost[]>([]);

  useEffect(() => {
    postsApi
      .get(`/${profileId ? `?sender=${profileId}` : ""}`)
      .then(({ data }) => {
        setPosts(data);
      });
  }, [profileId]);

  return posts;
};
