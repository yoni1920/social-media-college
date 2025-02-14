import { Stack } from "@mui/material";
import { GradientCircularProgress } from "../../components/GradientCircularProgress";
import { usePosts } from "../hooks/use-posts";
import { NoPosts } from "./NoPosts";
import { Post } from "./Post";

type Props = {
  profileId?: string;
};
export const PostsFeed = ({ profileId }: Props) => {
  const { posts, isLoading, refresh } = usePosts(profileId);

  if (isLoading) {
    return <GradientCircularProgress />;
  }

  return (
    <Stack gap={2}>
      {posts?.length ? (
        posts?.map((post) => (
          <Post key={post._id} post={post} onChanged={refresh} />
        ))
      ) : (
        <NoPosts />
      )}
    </Stack>
  );
};
