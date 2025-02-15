import { Stack } from "@mui/material";
import { useAuth } from "../../auth/hooks/use-auth";
import { PostsFeed } from "../../posts/components/PostsFeed";
import { Navigate } from "react-router-dom";
import { PostsOrigin } from "../../store/posts";

export const Home = () => {
  const { user } = useAuth();

  return user ? (
    <Stack>
      <PostsFeed origin={PostsOrigin.HOME} />
    </Stack>
  ) : (
    <Navigate to={"/login"} />
  );
};
