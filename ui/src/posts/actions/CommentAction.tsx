import { IconButton, TextField } from "@mui/material";
import { useCallback, useState } from "react";
import { ConfirmationDialog } from "../../auth/components/ConfirmationDialog";
import { Comment } from "@mui/icons-material";
import { useUser } from "../../auth/hooks/use-auth";
import { commentsApi } from "../../api/comments-api";

type Props = { postID: string; onSuccess: () => void };
export const CommentAction = ({ postID, onSuccess }: Props) => {
  const [isCommenting, setIsCommenting] = useState(false);
  const [message, setMessage] = useState("");
  const user = useUser();

  const submitComment = useCallback(async () => {
    if (message !== "") {
      await commentsApi.post("/", { message, postID, sender: user._id });
      onSuccess();
      setMessage("");
    }
  }, [message, postID]);
  return (
    <>
      <IconButton
        color="primary"
        onClick={() => {
          setIsCommenting(true);
        }}>
        <Comment />
      </IconButton>
      <ConfirmationDialog
        open={isCommenting}
        close={() => {
          setIsCommenting(false);
        }}
        title="What's on your mind?"
        content={
          <TextField
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            multiline
            fullWidth
          />
        }
        confirmText="Comment"
        denyText="Cancel"
        onConfirm={submitComment}
      />
    </>
  );
};
