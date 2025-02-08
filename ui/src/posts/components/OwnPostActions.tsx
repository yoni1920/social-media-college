import { MoreHoriz } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useCallback, useState } from "react";
import { OwnPostsActionsMenu } from "./OwnPostActionsMenu";
import { EditPostDialog } from "./EditPostDialog";
import { TPost } from "../../types/post";
import { DeletePostDialog } from "./DeletePostDialog";

type Props = {
  onPostChange: () => void;
  post: TPost;
};

export const OwnPostActions = ({ onPostChange, post }: Props) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleToggleMenuClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setMenuAnchorEl(event.currentTarget);
    },
    []
  );

  const handleMenuClose = useCallback(() => {
    setMenuAnchorEl(null);
  }, []);

  const onEditPostClick = useCallback(() => {
    handleMenuClose();
    setIsEditDialogOpen(true);
  }, [handleMenuClose]);

  const onDeletePostClick = useCallback(() => {
    handleMenuClose();
    setIsDeleteDialogOpen(true);
  }, [handleMenuClose]);

  const onEditDialogClose = () => {
    setIsEditDialogOpen(false);
  };

  const onDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <IconButton
        sx={{ "&:hover": { backgroundColor: "transparent" } }}
        onClick={handleToggleMenuClick}
      >
        <MoreHoriz />
      </IconButton>

      <OwnPostsActionsMenu
        open={Boolean(menuAnchorEl)}
        anchorEl={menuAnchorEl}
        handleClose={handleMenuClose}
        onDeletePost={onDeletePostClick}
        onEditPost={onEditPostClick}
      />

      <EditPostDialog
        open={isEditDialogOpen}
        onSuccess={onPostChange}
        post={post}
        onClose={onEditDialogClose}
      />

      <DeletePostDialog
        open={isDeleteDialogOpen}
        onSuccess={onPostChange}
        postID={post._id}
        onClose={onDeleteDialogClose}
      />
    </>
  );
};
