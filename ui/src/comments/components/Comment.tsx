import { IconButton, Link, Stack, Typography } from "@mui/material";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../auth/hooks/use-auth";
import { UserAvatar } from "../../components/UserAvatar";
import { RouteTab } from "../../enums";
import { TComment } from "../../types";
import { getRelativeTime } from "../../utils/date";

type Props = {
  comment: TComment;
};

export const Comment = ({ comment }: Props) => {
  const navigate = useNavigate();
  const { user: ownUser } = useUser();

  const isOwnUser = useMemo(
    () => ownUser._id === comment.sender._id,
    [ownUser._id, comment.sender._id]
  );

  const onUsernameClick = useCallback(() => {
    navigate(
      isOwnUser ? RouteTab.USER_PROFILE : `/profile/${comment.sender._id}`
    );
  }, [isOwnUser, comment.sender._id, navigate]);

  return (
    <Stack direction="row" alignItems="center" gap={2} maxWidth={"600px"}>
      <IconButton sx={{ padding: 0 }} onClick={onUsernameClick}>
        <UserAvatar user={isOwnUser ? ownUser : comment.sender} />
      </IconButton>

      <Typography>
        <Link
          underline="none"
          onClick={onUsernameClick}
          component={"button"}
          color="black"
          sx={{
            fontWeight: "bold",
            fontSize: "0.9rem",
            mr: 1.5,
          }}
        >
          {comment.sender.username}
        </Link>
        {comment.message}
      </Typography>

      <Typography sx={{ color: "text.secondary", fontSize: "0.8rem" }}>
        {getRelativeTime(comment.createdAt)}
      </Typography>
    </Stack>
  );
};
