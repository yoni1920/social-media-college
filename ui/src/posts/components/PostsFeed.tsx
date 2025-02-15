import { Pagination, Stack, useEventCallback } from "@mui/material";
import { usePosts } from "../hooks/use-posts";
import { NoPosts } from "./NoPosts";
import { Post } from "./Post";
import { ChangeEvent } from "react";
import { GradientCircularProgress } from "../../components/GradientCircularProgress";
import { PostsOrigin } from "../../store/posts";
import { useResetPostsByOrigin } from "../../hooks/use-reset-posts-by-origin";

type Props = {
  profileId?: string;
  origin: PostsOrigin;
};
export const PostsFeed = ({ profileId, origin }: Props) => {
  const { posts, isLoading, refresh, page, totalPages, setPage } =
    usePosts(profileId);

  useResetPostsByOrigin(origin);

  const handlePageChange = useEventCallback((e: ChangeEvent<any>) =>
    setPage(e.target.valueAsNumber)
  );

  if (isLoading) {
    return <GradientCircularProgress />;
  }

  return (
    <Stack gap={2} alignItems={"center"}>
      {posts?.length ? (
        posts?.map((post) => (
          <Post key={post._id} post={post} onChanged={refresh} />
        ))
      ) : (
        <NoPosts />
      )}
      <Pagination
        page={page}
        onChange={handlePageChange}
        hideNextButton={totalPages <= 1}
        count={totalPages}
      />
    </Stack>
  );
};
