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
  sx?: ButtonProps["sx"];
  loading?: boolean;
};

export const FormSubmitButton = ({
  disabled,
  text,
  sx,
  loading = false,
}: Props) => {
  const theme = useTheme();

  return (
    <Button
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
