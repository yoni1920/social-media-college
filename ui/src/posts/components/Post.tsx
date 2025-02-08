import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useUser } from "../../auth/hooks/use-auth";
import { SenderInfo } from "../../nav-bar/components/SenderInfo";
import { TPost } from "../../types/post";
import { CommentAction } from "../actions/CommentAction";
import { Comments } from "../comments/Comments";
import { useComments } from "../comments/use-comments";
import { OwnPostActions } from "./OwnPostActions";

type Props = {
  post: TPost;
  onChanged: () => void;
};
export const Post = ({ post, onChanged }: Props) => {
  const [areCommentsShown, setAreCommentsShown] = useState(false);
  const { comments, isLoading, refresh } = useComments(post._id);
  const { user: ownUser } = useUser();

  const isOwnUser = useMemo(
    () => ownUser._id === post.sender._id,
    [ownUser._id, post.sender._id]
  );

  return (
    <Card sx={{ mt: 2, maxWidth: "400px" }} elevation={3}>
      <CardContent>
        <Stack>
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <SenderInfo sender={post.sender} />
            {isOwnUser && (
              <OwnPostActions post={post} onPostChange={onChanged} />
            )}
          </Stack>
          <Box
            component="img"
            marginTop={1}
            width="350px"
            height="350px"
            src={`${import.meta.env.VITE_SERVER_URL}/posts/image/${
              post._id
            }?fileName=${post.fileName}`}
          />
        </Stack>

        <Stack direction={"row"} alignItems={"center"}>
          <IconButton sx={{ height: "2rem", width: "2rem" }}>
            <FavoriteBorderOutlinedIcon />
          </IconButton>
          <CommentAction postID={post._id} onSuccess={refresh} />
        </Stack>

        <Stack direction={"row"} alignItems={"center"} gap={2}>
          <Typography sx={{ fontSize: 14 }}>
            <strong>{post?.sender.username}</strong> {post.message}
          </Typography>
        </Stack>

        <Button
          onClick={() => setAreCommentsShown((curr) => !curr)}
          variant="text"
          sx={{
            color: "text.secondary",
            minWidth: "32px",
            fontSize: "0.6rem",
          }}
        >
          {areCommentsShown ? "Hide comments" : "Show comments"}
        </Button>
        {areCommentsShown && (
          <Comments comments={comments} isLoading={isLoading} />
        )}
      </CardContent>
    </Card>
  );
};
