import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { LoadingButton } from "../../components/LoadingButton";
import { commentsApi } from "../../api/comments-api";
import { useState } from "react";
import { useUser } from "../../auth/hooks/use-auth";

type Props = {
  open: boolean;
  postID: string;
  close: () => void;
};
export const AddCommentDialog = ({ open, postID, close }: Props) => {
  const [message, setMessage] = useState("");
  const { _id } = useUser();

  const submitComment = async () => {
    await commentsApi.post("/", {
      postID,
      message: message,
      sender: _id,
    });
    close();
  };

  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle>What do you think?</DialogTitle>
      <DialogContent>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          multiline
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>Cancel</Button>
        <LoadingButton onClick={submitComment}>Submit</LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
