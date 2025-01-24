import { List, Stack, Typography } from "@mui/material";
import { useAuth, useUser } from "../../auth/hooks/use-auth";
import { usePosts } from "../../posts/hooks/usePosts";
import { Post } from "../../posts/Post";
import { PostsFeed } from "../../posts/PostsFeed";

export const Profile = () => {
  const user = useUser();
  return (
    <Stack>
      <Typography>{user.name}</Typography>
      <PostsFeed profileId={user._id} />
    </Stack>
  );
};
