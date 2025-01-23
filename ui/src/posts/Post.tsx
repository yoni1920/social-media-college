import { Typography } from "@mui/material";
import { TPost } from "../types/post";

type Props = {
  post: TPost;
};
export const Post = ({ post }: Props) => {
  return <Typography>{post.message}</Typography>;
};
