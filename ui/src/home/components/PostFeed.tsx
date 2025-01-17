import { Stack, Typography } from "@mui/material";
import { useAuth } from "../../auth/hooks/useAuth";
import { User } from "../../types";

export const PostFeed = () => {
  const { user } = useAuth();

  const { name, email, birthDate, username } = user as User;

  return (
    <Stack>
      <Typography>hello</Typography>
      <Typography>{name}</Typography>
      <Typography>{email}</Typography>
      <Typography>{username}</Typography>
      <Typography>{birthDate.toDateString()}</Typography>
    </Stack>
  );
};
