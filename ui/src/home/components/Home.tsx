import { Avatar, Stack, Typography } from "@mui/material";
import { useAuth } from "../../auth/hooks/use-auth";

export const Home = () => {
  const { user } = useAuth();

  return user ? (
    <Stack>
      <Typography>hello</Typography>
      <Typography>{user.name}</Typography>
      <Typography>{user.email}</Typography>
      <Typography>{user.username}</Typography>
      <Typography>{user.birthDate.toDateString()}</Typography>
      <Avatar src={user.picture} alt={user.name} />
    </Stack>
  ) : null;
};
