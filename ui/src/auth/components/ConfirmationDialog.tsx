import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { FormSubmitButton } from "../../components/FormSubmitButton";

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
        <FormSubmitButton onClick={confirm} text={confirmText} />
      </DialogActions>
    </Dialog>
  );
};
