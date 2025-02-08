import { Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useComments } from "../hooks/use-comments";
import { Comments } from "./Comments";

// TODO: style
export const PostComments = () => {
  const { postID } = useParams();

  const { comments, isLoading } = useComments(postID);

  return (
    <>
      <Typography>{`${postID} comments page`}</Typography>
      <Comments comments={comments} isLoading={isLoading} />
    </>
  );
};
