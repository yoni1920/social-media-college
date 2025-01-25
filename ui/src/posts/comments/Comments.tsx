import { Stack } from "@mui/material";
import { useComments } from "./use-comments";
import { Comment } from "./Comment";
import { GradientCircularProgress } from "../../components/GradientLoader";

type Props = {
  postId: string;
};
export const Comments = ({ postId }: Props) => {
  const { comments, isLoading } = useComments(postId);

  return (
    <Stack gap={2}>
      {!isLoading ? (
        comments?.map((comment) => (
          <Comment
            key={comment._id}
            sender={comment.sender}
            message={comment.message}
          />
        ))
      ) : (
        <GradientCircularProgress />
      )}
    </Stack>
  );
};
