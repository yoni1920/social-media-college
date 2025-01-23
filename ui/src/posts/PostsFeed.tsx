import { Stack } from "@mui/material";
import { usePosts } from "./hooks/usePosts";
import { Post } from "./Post";

type Props = {
  profileId?: string;
};
export const PostsFeed = ({ profileId }: Props) => {
  const posts = usePosts(profileId);

  return (
    <Stack gap={2} marginBlock={3}>
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </Stack>
  );
};
