import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { IconButton, TextField } from "@mui/material";
import { ChangeEvent, useCallback, useState } from "react";
import { commentsApi } from "../../api/comments-api";
import { ConfirmationDialog } from "../../auth/components/ConfirmationDialog";
import { useUser } from "../../auth/hooks/use-auth";

type Props = {
  postID: string;
  onSuccess: () => void;
};

export const CommentAction = ({ postID, onSuccess }: Props) => {
  const [isCommenting, setIsCommenting] = useState(false);
  const [message, setMessage] = useState("");
  const { user } = useUser();

  const submitComment = useCallback(async () => {
    if (message !== "") {
      await commentsApi.post("/", { message, postID, sender: user._id });
      onSuccess();
      setMessage("");
    }
  }, [message, postID, onSuccess, user._id]);

  const onChangeMessage = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setMessage(event.target.value);
    },
    []
  );

  return (
    <>
      <IconButton
        disableRipple
        onClick={() => {
          setIsCommenting(true);
        }}
        sx={{
          "&:hover": {
            color: "black",
          },
        }}>
        <ChatBubbleOutlineIcon />
      </IconButton>

      <ConfirmationDialog
        open={isCommenting}
        close={() => {
          setIsCommenting(false);
        }}
        title="What's on your mind?"
        content={
          <TextField
            autoFocus
            value={message}
            onChange={onChangeMessage}
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
