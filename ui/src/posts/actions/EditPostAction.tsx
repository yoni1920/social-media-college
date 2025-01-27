import { Edit } from "@mui/icons-material";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { useState } from "react";
import { SavePostForm } from "../../new-post/components/SavePostForm";
import { TPost } from "../../types/post";

type Props = { post: TPost; onSuccess: () => void };

export const EditPostAction = ({ onSuccess, post }: Props) => {
  const [isDialogShown, setIsDialogShown] = useState(false);

  return (
    <>
      <IconButton
        onClick={() => {
          setIsDialogShown(true);
        }}
      >
        <Edit />
      </IconButton>
      <Dialog open={isDialogShown} onClose={() => setIsDialogShown(false)}>
        <DialogTitle>Update Post</DialogTitle>
        <DialogContent>
          <SavePostForm post={post} onSuccess={onSuccess} />
        </DialogContent>
      </Dialog>
    </>
  );
};
