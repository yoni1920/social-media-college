import {
  Button,
  ButtonProps,
  CircularProgress,
  Typography,
  useTheme,
} from "@mui/material";

type Props = {
  disabled?: boolean;
  text: string;
  loading?: boolean;
} & ButtonProps;

export const FormSubmitButton = ({
  disabled,
  text,
  sx,
  loading = false,
  ...buttonProps
}: Props) => {
  const theme = useTheme();

  return (
    <Button
      {...buttonProps}
      type="submit"
      size="large"
      variant="contained"
      disabled={disabled || loading}
      sx={{
        background: theme.palette.gradient.main,
        paddingY: "0.8rem",
        width: "60%",
        "&:disabled": {
          opacity: 0.5,
        },
        ...sx,
      }}
    >
      {loading ? (
        <CircularProgress
          thickness={5}
          sx={{ color: "#0255d1" }}
          size={"24px"}
        />
      ) : (
        <Typography fontSize={"medium"} fontWeight={"500"}>
          {text ?? ""}
        </Typography>
      )}
    </Button>
  );
};
