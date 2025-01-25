import {
  Box,
  Stack,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { TPost } from "../types/post";
import { useState } from "react";
import { Comments } from "./comments/Comments";
import { SenderInfo } from "../nav-bar/components/SenderInfo";
import { useComments } from "./comments/use-comments";
import { CommentAction } from "./actions/CommentAction";
import { useUser } from "../auth/hooks/use-auth";
import { DeletePostAction } from "./actions/DeletePostAction";
import { EditPostAction } from "./actions/EditPostAction";

type Props = {
  post: TPost;
  onChanged: () => void;
};
export const Post = ({ post, onChanged }: Props) => {
  const [areCommentsShown, setAreCommentsShown] = useState(false);
  const { comments, isLoading, refresh } = useComments(post._id);
  const { _id: userId } = useUser();

  return (
    <Card>
      <CardContent>
        <Stack direction="row" alignItems="center" gap={1}>
          <SenderInfo sender={post.sender} />
        </Stack>
        <Box
          component="img"
          marginBlock={1}
          width="300px"
          height="300px"
          src={`${import.meta.env.VITE_SERVER_URL}/posts/image/${
            post._id
          }?fileName=${post.fileName}`}
        />
        <CardActions sx={{ justifyContent: "space-between" }}>
          <CommentAction postID={post._id} onSuccess={refresh} />
          {userId === post.sender._id && (
            <Box>
              <EditPostAction post={post} onSuccess={onChanged} />
              <DeletePostAction postID={post._id} onSuccess={onChanged} />
            </Box>
          )}
        </CardActions>
        <Typography marginBlockEnd={1} marginInlineStart={1}>
          {post.message}
        </Typography>
        <Button
          onClick={() => setAreCommentsShown((curr) => !curr)}
          variant="text"
          sx={{
            color: "text.secondary",
            minWidth: "32px",
            fontSize: "0.6rem",
          }}>
          {areCommentsShown ? "Hide comments" : "Show comments"}
        </Button>
        {areCommentsShown && (
          <Comments comments={comments} isLoading={isLoading} />
        )}
      </CardContent>
    </Card>
  );
};
