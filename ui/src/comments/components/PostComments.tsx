import { Pagination, Typography, useEventCallback } from "@mui/material";
import { useParams } from "react-router-dom";
import { useComments } from "../hooks/use-comments";
import { Comments } from "./Comments";

// TODO: style
export const PostComments = () => {
  const { postID } = useParams();

  const { comments, isLoading, setPage, page, totalPages } =
    useComments(postID);

  return (
    <>
      <Typography>{`${postID} comments page`}</Typography>
      <Comments comments={comments} isLoading={isLoading} />
      <Pagination
        page={page}
        count={totalPages}
        hideNextButton={totalPages <= 1}
        onChange={useEventCallback((e) => setPage(e.target.value))}
      />
    </>
  );
};
