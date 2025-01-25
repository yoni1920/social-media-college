import { Stack } from "@mui/material";
import { usePosts } from "./hooks/use-posts";
import { Post } from "./Post";
import { GradientCircularProgress } from "../components/GradientLoader";

type Props = {
  profileId?: string;
};
export const PostsFeed = ({ profileId }: Props) => {
  const { posts, isLoading, refresh } = usePosts(profileId);

  return (
    <Stack gap={2} marginBlock={3}>
      {!isLoading ? (
        posts?.map((post) => (
          <Post key={post._id} post={post} onChanged={refresh} />
        ))
      ) : (
        <GradientCircularProgress />
      )}
    </Stack>
  );
};
