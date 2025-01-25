import { Stack, Typography } from "@mui/material";
import { TPost } from "../../types/post";
import { SenderInfo } from "../../nav-bar/components/SenderInfo";

type Props = {
  sender: TPost["sender"];
  message: string;
};
export const Comment = ({ sender, message }: Props) => {
  return (
    <Stack direction="row" alignItems="center" gap={1}>
      <SenderInfo sender={sender} />
      <Typography>{message}</Typography>
    </Stack>
  );
};
