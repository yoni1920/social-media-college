import {
  Button,
  Pagination,
  Stack,
  Typography,
  useEventCallback,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useComments } from "../hooks/use-comments";
import { Comments } from "./Comments";
import { ArrowBack } from "@mui/icons-material";

// TODO: style
export const PostComments = () => {
  const { postID } = useParams();

  const navigate = useNavigate();

  const { comments, isLoading, setPage, page, totalPages } =
    useComments(postID);

  return (
    <Stack gap={2} alignItems="center">
      <Typography>{`comments page`}</Typography>
      <Button variant="contained" onClick={() => navigate(-1)}>
        <ArrowBack />
        Back to Post
      </Button>
      <Comments comments={comments} isLoading={isLoading} />
      <Pagination
        page={page}
        count={totalPages}
        hideNextButton={totalPages <= 1}
        onChange={useEventCallback((_, page) => setPage(page))}
      />
    </Stack>
  );
};
