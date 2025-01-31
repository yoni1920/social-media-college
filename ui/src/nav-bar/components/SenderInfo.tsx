import { Button, IconButton, Link } from "@mui/material";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../auth/hooks/use-auth";
import { UserAvatar } from "../../components/UserAvatar";
import { RouteTab } from "../../enums";
import { TPost } from "../../types/post";

type Props = {
  sender: TPost["sender"];
};

export const SenderInfo = ({ sender }: Props) => {
  const navigate = useNavigate();
  const { user: ownUser } = useUser();

  const isOwnUser = useMemo(
    () => ownUser._id === sender._id,
    [ownUser._id, sender._id]
  );

  const onUsernameClick = useCallback(() => {
    navigate(isOwnUser ? RouteTab.USER_PROFILE : `/profile/${sender._id}`);
  }, [isOwnUser, sender._id, navigate]);

  return (
    <>
      <IconButton sx={{ padding: 0 }} onClick={onUsernameClick}>
        <UserAvatar user={isOwnUser ? ownUser : sender} />
      </IconButton>

      <Link
        underline="none"
        onClick={onUsernameClick}
        component={"button"}
        color="black"
      >
        {sender.username}
      </Link>
    </>
  );
};
