import { Divider, Stack } from "@mui/material";
import { TComment } from "../../types/comment";
import { Comment } from "./Comment";

type Props = {
  comments?: TComment[];
};

export const Comments = ({ comments = [] }: Props) => {
  return (
    <Stack gap={2}>
      {comments?.map((comment, index) => (
        <Stack key={comment._id} gap={2}>
          {index > 0 && (
            <Divider
              orientation="horizontal"
              sx={{ width: "500px", alignSelf: "center" }}
            />
          )}
          <Comment key={comment._id} comment={comment} />
        </Stack>
      ))}
    </Stack>
  );
};
