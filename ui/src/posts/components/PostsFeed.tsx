import { Pagination, Stack, useEventCallback } from "@mui/material";
import { GradientCircularProgress } from "../../components/GradientLoader";
import { usePosts } from "../hooks/use-posts";
import { NoPosts } from "./NoPosts";
import { Post } from "./Post";
import { ChangeEvent } from "react";

type Props = {
  profileId?: string;
};
export const PostsFeed = ({ profileId }: Props) => {
  const { posts, isLoading, refresh, page, totalPages, setPage } =
    usePosts(profileId);

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
