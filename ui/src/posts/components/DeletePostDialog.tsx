import { useCallback } from "react";
import { postsApi } from "../../api/posts-api";
import { ConfirmationDialog } from "../../auth/components/ConfirmationDialog";

type Props = {
  postID: string;
  onSuccess: () => void;
  onClose: () => void;
  open?: boolean;
};

export const DeletePostDialog = ({
  onSuccess,
  postID,
  onClose,
  open = false,
}: Props) => {
  const onDeletePost = useCallback(async () => {
    await postsApi.delete(postID);
    onSuccess();
  }, [onSuccess, postID]);

  return (
    <ConfirmationDialog
      open={open}
      close={onClose}
      title="Delete post?"
      content="Are you sure you want to delete this post?"
      onConfirm={onDeletePost}
      confirmText="Delete"
    />
  );
};
