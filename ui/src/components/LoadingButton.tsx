import { Button, ButtonProps, CircularProgress } from "@mui/material";
import { useState } from "react";

type Props = Omit<ButtonProps, "onClick"> & {
  onClick?: (
    ...params: Parameters<NonNullable<ButtonProps["onClick"]>>
  ) => Promise<void>;
  onClickError?: () => void;
};
export const LoadingButton = ({
  onClick,
  onClickError,
  children,
  ...props
}: Props) => {
  const [loading, setLoading] = useState(false);

  const onClickWithLoadingState = async (
    ...params: Parameters<NonNullable<typeof onClick>>
  ) => {
    if (onClick) {
      setLoading(true);
      try {
        await onClick(...params);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        onClickError?.();
      }
    }
  };

  return (
    <Button onClick={onClickWithLoadingState} {...props}>
      {loading ? <CircularProgress /> : children}
    </Button>
  );
};
