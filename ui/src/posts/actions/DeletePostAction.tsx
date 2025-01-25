import { Delete } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { postsApi } from "../../api/posts-api";
import { useState } from "react";
import { ConfirmationDialog } from "../../auth/components/ConfirmationDialog";

type Props = { postID: string; onSuccess: () => void };
export const DeletePostAction = ({ onSuccess, postID }: Props) => {
  const [isDialogShown, setIsDialogShown] = useState(false);

  return (
    <>
      <IconButton
        color="error"
        onClick={() => {
          setIsDialogShown(true);
        }}>
        <Delete />
      </IconButton>
      <ConfirmationDialog
        open={isDialogShown}
        close={() => {
          setIsDialogShown(false);
        }}
        title="Delete post?"
        content="Are you sure you want to delete this post?"
        onConfirm={async () => {
          await postsApi.delete(postID);
          onSuccess();
        }}
        confirmText="Delete"
      />
    </>
  );
};
