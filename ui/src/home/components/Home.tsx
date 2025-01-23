import { Avatar, Stack, Typography } from "@mui/material";
import { useAuth } from "../../auth/hooks/use-auth";
import { PostsFeed } from "../../posts/PostsFeed";

export const Home = () => {
  const { user } = useAuth();

  return user ? (
    <Stack>
      <PostsFeed />
    </Stack>
  ) : null;
};
