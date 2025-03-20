import CloseIcon from "@mui/icons-material/Close";
import { Dialog, DialogTitle, IconButton } from "@mui/material";
import { SavePostForm } from "../../new-post/components/SavePostForm";
import { TPost } from "../../types/post";
import { SavePostMode } from "../enums/save-post-mode.enum";

type Props = {
  post: TPost;
  onSuccess: () => void;
  open?: boolean;
  onClose: () => void;
};

export const EditPostDialog = ({
  onSuccess,
  post,
  open = false,
  onClose,
}: Props) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ marginLeft: "auto", marginRight: "auto" }}>
        Update Post
      </DialogTitle>

      <IconButton
        sx={{
          position: "absolute",
          right: 10,
          top: 10,
          "&:hover": { background: "transparent" },
        }}
        onClick={onClose}
      >
        <CloseIcon />
      </IconButton>

      <SavePostForm
        post={post}
        onSuccess={onSuccess}
        savePostMode={SavePostMode.EDIT}
      />
    </Dialog>
  );
};
