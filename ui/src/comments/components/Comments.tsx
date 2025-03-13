import { Divider, Stack } from "@mui/material";
import { GradientCircularProgress } from "../../components/GradientCircularProgress";
import { TComment } from "../../types/comment";
import { Comment } from "./Comment";

type Props = {
  comments?: TComment[];
  isLoading: boolean;
};
export const Comments = ({ comments = [], isLoading = false }: Props) => {
  return (
    <Stack gap={2}>
      {!isLoading ? (
        comments?.map((comment, index) => (
          <Stack key={comment._id} gap={2}>
            {index > 0 && (
              <Divider
                orientation="horizontal"
                sx={{ width: "500px", alignSelf: "center" }}
              />
            )}
            <Comment key={comment._id} comment={comment} />
          </Stack>
        ))
      ) : (
        <GradientCircularProgress />
      )}
    </Stack>
  );
};
