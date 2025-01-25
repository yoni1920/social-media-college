import { Button, Stack, Typography } from "@mui/material";
import { TPost } from "../../types/post";
import { UserAvatar } from "../../components/UserAvatar";
import { useNavigate } from "react-router-dom";

type Props = {
  sender: TPost["sender"];
  message: string;
};
export const Comment = ({ sender, message }: Props) => {
  const navigate = useNavigate();
  return (
    <Stack direction="row" alignItems="center" gap={1}>
      <UserAvatar name={sender.name} picture={sender.picture} />
      <Button variant="text" onClick={() => navigate(`/profile/${sender._id}`)}>
        {sender.username}
      </Button>
      <Typography>{message}</Typography>
    </Stack>
  );
};
