import { Stack } from "@mui/material";
import { useAuth } from "../../auth/hooks/use-auth";
import { PostsFeed } from "../../posts/PostsFeed";
import { Navigate } from "react-router-dom";

export const Home = () => {
  const { user } = useAuth();

  return user ? (
    <Stack>
      <PostsFeed />
    </Stack>
  ) : (
    <Navigate to={"/login"} />
  );
};
