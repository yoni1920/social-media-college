import { Box, Stack, Typography, Avatar } from "@mui/material";
import { TPost } from "../types/post";

type Props = {
  post: TPost;
};
export const Post = ({ post }: Props) => {
  return (
    <Stack gap={1}>
      <Stack direction="row" alignItems="center" gap={1}>
        <Avatar
          alt={post.sender.name ?? ""}
          src={post.sender.picture ?? ""}
          sx={{ width: 36, height: 36 }}
        />
        <Typography>{post.sender.username}</Typography>
      </Stack>
      <Box
        component="img"
        maxWidth="300px"
        maxHeight="300px"
        src={`${import.meta.env.VITE_SERVER_URL}/posts/image/${post._id}`}
      />
      <Typography>{post.message}</Typography>
    </Stack>
  );
};
