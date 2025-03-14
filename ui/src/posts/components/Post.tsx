import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postsApi } from "../../api/posts-api";
import { useUser } from "../../auth/hooks/use-auth";
import { SenderInfo } from "../../nav-bar/components/SenderInfo";
import { User } from "../../types";
import { TPost } from "../../types/post";
import { getRelativeTime } from "../../utils/date";
import { LikeMethod } from "../enums";
import { CommentAction } from "./CommentAction";
import { LikeButton } from "./LikeButton";
import { OwnPostActions } from "./OwnPostActions";

type Props = {
  post: TPost;
  onChanged: () => void;
};

const isPostLikedAlready = (post: TPost, ownUserID: User["_id"]) => {
  return post.likes.some(({ user }) => user === ownUserID);
};

export const Post = ({ post, onChanged }: Props) => {
  const navigate = useNavigate();
  const { user: ownUser } = useUser();

  const isLikedAlready = useMemo(
    () => isPostLikedAlready(post, ownUser._id),
    [ownUser._id, post]
  );

  const [isLiked, setIsLiked] = useState(isLikedAlready);
  const [numLikes, setNumLikes] = useState(post.likes.length);

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

  const goToCommentSection = useCallback(() => {
    navigate(`/comments/${post._id}`);
  }, [navigate, post._id]);

  return (
    <Card sx={{ mt: 2, maxWidth: "450px" }} elevation={3}>
      <CardContent>
        <Stack>
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}>
            <Stack direction={"row"} alignItems={"center"} gap={0.5}>
              <SenderInfo sender={post.sender} />
              <Typography sx={{ color: "text.secondary" }}>◦</Typography>
              <Typography sx={{ color: "text.secondary", fontSize: "0.8rem" }}>
                {getRelativeTime(post.createdAt)}
              </Typography>
            </Stack>

            {isOwnUser && (
              <OwnPostActions post={post} onPostChange={onChanged} />
            )}
          </Stack>
          <Box
            component="img"
            marginTop={1}
            width="400px"
            height="300px"
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
          <CommentAction postID={post._id} onSuccess={goToCommentSection} />
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
          onClick={goToCommentSection}
          variant="text"
          sx={{
            color: "text.secondary",
            minWidth: "32px",
            fontSize: "0.6rem",
          }}>
          {post.numComments
            ? `View all ${post.numComments} comments`
            : "View comments"}
        </Button>
      </CardContent>
    </Card>
  );
};
