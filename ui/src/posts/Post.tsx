import {
  Box,
  Stack,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Fab,
  IconButton,
} from "@mui/material";
import { TPost } from "../types/post";
import { useNavigate } from "react-router-dom";
import { UserAvatar } from "../components/UserAvatar";
import { Comment } from "@mui/icons-material";
import { useState } from "react";
import { Comments } from "./comments/Comments";
import { AddCommentDialog } from "./comments/AddCommentDialog";

type Props = {
  post: TPost;
};
export const Post = ({ post }: Props) => {
  const [areCommentsShown, setAreCommentsShown] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const navigate = useNavigate();
  return (
    <Card>
      <CardContent>
        <Stack direction="row" alignItems="center" gap={1}>
          <UserAvatar name={post.sender.name} picture={post.sender.picture} />
          <Button
            variant="text"
            onClick={() => navigate(`/profile/${post.sender._id}`)}>
            {post.sender.username}
          </Button>
        </Stack>
        <Box
          component="img"
          marginBlock={1}
          width="300px"
          height="300px"
          src={`${import.meta.env.VITE_SERVER_URL}/posts/image/${post._id}`}
        />
        <CardActions>
          <IconButton color="primary" onClick={() => setIsCommenting(true)}>
            <Comment />
          </IconButton>
          <AddCommentDialog
            open={isCommenting}
            close={() => setIsCommenting(false)}
            postID={post._id}
          />
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
        {areCommentsShown && <Comments postId={post._id} />}
      </CardContent>
    </Card>
  );
};
