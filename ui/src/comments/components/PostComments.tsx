import { ArrowBack } from "@mui/icons-material";
import { Button, Pagination, Stack, useEventCallback } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useComments } from "../hooks/use-comments";
import { Comments } from "./Comments";
import { useCallback } from "react";
import { NoComments } from "./NoComments";

export const PostComments = () => {
  const { postID } = useParams();

  const navigate = useNavigate();

  const { comments, isLoading, setPage, page, totalPages } =
    useComments(postID);

  const changePage = useEventCallback((_, page: number) => setPage(page));

  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <Stack alignItems="center" height={"100%"} width={"100%"} my={2} gap={3}>
      <Button variant="contained" onClick={goBack}>
        <ArrowBack />
        Back to Post
      </Button>

      {comments?.length ? (
        <>
          <Comments comments={comments} isLoading={isLoading} />

          <Pagination
            sx={{ marginTop: "auto" }}
            page={page}
            count={totalPages}
            hideNextButton={totalPages <= 1}
            onChange={changePage}
          />
        </>
      ) : (
        <NoComments />
      )}
    </Stack>
  );
};
