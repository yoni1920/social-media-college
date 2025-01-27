import { Button, ButtonProps, Typography, useTheme } from "@mui/material";

type Props = {
  disabled?: boolean;
  text: string;
  sx?: ButtonProps["sx"];
};

export const FormSubmitButton = ({ disabled, text, sx }: Props) => {
  const theme = useTheme();

  return (
    <Button
      type="submit"
      size="large"
      variant="contained"
      disabled={disabled}
      sx={{
        background: theme.palette.gradient.main,
        padding: "0.6rem",
        width: "60%",
        "&:disabled": {
          opacity: 0.5,
        },
        ...sx,
      }}
    >
      <Typography fontSize={"medium"} fontWeight={"500"}>
        {text ?? ""}
      </Typography>
    </Button>
  );
};
