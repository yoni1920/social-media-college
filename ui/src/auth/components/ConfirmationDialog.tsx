import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { LoadingButton } from "../../components/LoadingButton";

type Props = {
  open: boolean;
  close: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  content: JSX.Element | null | string;
  confirmText: string;
  denyText?: string;
};
export const ConfirmationDialog = ({
  open,
  close,
  onConfirm,
  title,
  content = null,
  confirmText = "Confirm",
  denyText = "Cancel",
}: Props) => {
  const confirm = async () => {
    await onConfirm();
    close();
  };

  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>
        <Button onClick={close}>{denyText}</Button>
        <LoadingButton onClick={confirm}>{confirmText}</LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
