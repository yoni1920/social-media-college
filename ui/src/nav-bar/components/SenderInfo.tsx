import { useNavigate } from "react-router-dom";
import { useUser } from "../../auth/hooks/use-auth";
import { TPost } from "../../types/post";
import { useCallback } from "react";
import { Button } from "@mui/material";
import { UserAvatar } from "../../components/UserAvatar";
import { RouteTab } from "../../enums";

type Props = {
  sender: TPost["sender"];
};
export const SenderInfo = ({ sender }: Props) => {
  const navigate = useNavigate();
  const { user: ownUser } = useUser();

  const onUsernameClick = useCallback(() => {
    navigate(
      ownUser._id === sender._id
        ? RouteTab.USER_PROFILE
        : `/profile/${sender._id}`
    );
  }, [sender._id, ownUser._id, navigate]);

  return (
    <>
      <UserAvatar name={sender.name} picture={sender.picture} />
      <Button variant="text" onClick={onUsernameClick}>
        {sender.username}
      </Button>
    </>
  );
};
