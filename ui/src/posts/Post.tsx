import { Stack, Typography } from "@mui/material";
import { TPost } from "../types/post";

type Props = {
  post: TPost;
};
export const Post = ({ post }: Props) => {
  return (
    <Stack gap={1}>
      <Typography>{post.sender.username}</Typography>
      <Typography>{post.message}</Typography>
    </Stack>
  );
};
