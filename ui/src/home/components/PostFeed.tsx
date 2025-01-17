import { Stack, Typography } from "@mui/material";
import { useAuth } from "../../auth/hooks/use-auth";

export const PostFeed = () => {
  const { user } = useAuth();

  return user ? (
    <Stack>
      <Typography>hello</Typography>
      <Typography>{user.name}</Typography>
      <Typography>{user.email}</Typography>
      <Typography>{user.username}</Typography>
      <Typography>{user.birthDate.toDateString()}</Typography>
    </Stack>
  ) : null;
};
