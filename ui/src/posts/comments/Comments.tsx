import { Divider, Stack } from "@mui/material";
import { Comment } from "./Comment";
import { GradientCircularProgress } from "../../components/GradientLoader";
import { TComment } from "../../types/comment";

type Props = {
  comments?: TComment[];
  isLoading: boolean;
};
export const Comments = ({ comments = [], isLoading = false }: Props) => {
  return (
    <Stack gap={2}>
      {!isLoading ? (
        comments?.map((comment, index) => (
          <>
            {index > 0 && <Divider orientation="horizontal" />}
            <Comment
              key={comment._id}
              sender={comment.sender}
              message={comment.message}
            />
          </>
        ))
      ) : (
        <GradientCircularProgress />
      )}
    </Stack>
  );
};
