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
import { useCallback, useMemo, useState } from "react";
import { useUser } from "../../auth/hooks/use-auth";
import { SenderInfo } from "../../nav-bar/components/SenderInfo";
import { TPost } from "../../types/post";
import { CommentAction } from "../actions/CommentAction";
import { Comments } from "../comments/Comments";
import { useComments } from "../comments/use-comments";
import { OwnPostActions } from "./OwnPostActions";
import { LikeButton } from "./LikeButton";
import { postsApi } from "../../api/posts-api";
import { LikeMethod } from "../enums";
import { User } from "../../types";

type Props = {
  post: TPost;
  onChanged: () => void;
};

const isPostLikedAlready = (post: TPost, ownUserID: User["_id"]) => {
  return post.likes.some(({ user }) => user === ownUserID);
};

export const Post = ({ post, onChanged }: Props) => {
  const { user: ownUser } = useUser();

  const isLikedAlready = useMemo(
    () => isPostLikedAlready(post, ownUser._id),
    [ownUser._id, post]
  );

  const [isLiked, setIsLiked] = useState(isLikedAlready);

  const [numLikes, setNumLikes] = useState(post.likes.length);

  const [areCommentsShown, setAreCommentsShown] = useState(false);
  const { comments, isLoading, refresh } = useComments(post._id);

  const isOwnUser = useMemo(
    () => ownUser._id === post.sender._id,
    [ownUser._id, post.sender._id]
  );

  const onLiked = useCallback(() => {
    const method = isLiked ? LikeMethod.DISLIKE : LikeMethod.LIKE;

    postsApi.patch(`${post._id}/likes`, {
      user: ownUser._id,
      method,
    });

    setNumLikes((numLikes) =>
      method === LikeMethod.LIKE ? numLikes + 1 : Math.max(numLikes - 1, 0)
    );

    setIsLiked((liked) => !liked);
  }, [isLiked, ownUser._id, post._id]);

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
          <LikeButton
            liked={isLiked}
            onLiked={onLiked}
            initiallyLiked={isLikedAlready}
          />
          <CommentAction postID={post._id} onSuccess={refresh} />
        </Stack>

        <Stack gap={1}>
          {numLikes ? (
            <Typography fontWeight={"bold"} sx={{ fontSize: 14 }}>
              {numLikes > 1 ? `${numLikes} likes` : `${numLikes} like`}
            </Typography>
          ) : null}

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
