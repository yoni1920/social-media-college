import { Button, ButtonProps, useTheme } from "@mui/material";
import { APP_GRADIENT_ID, AppGradient } from "./AppGradient";
import { ReactNode } from "react";

type Props = {
  text: ReactNode;
} & ButtonProps;

export const GradientButton = ({ text, sx, ...buttonProps }: Props) => {
  const { palette } = useTheme();

  return (
    <>
      <AppGradient />
      <Button
        sx={{
          "& .MuiButton-endIcon svg": {
            fill: `url(#${APP_GRADIENT_ID})`,
            transition: "transform 0.3s ease-in-out",
          },
          "& .MuiButton-startIcon svg": {
            fill: `url(#${APP_GRADIENT_ID})`,
            transition: "transform 0.3s ease-in-out",
          },
          background: palette.gradient.main,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          borderRadius: "5px",
          border: "none",
          position: "relative",
          transition: "all 0.2s ease-in-out",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            borderRadius: "5px",
            padding: "1px",
            background: palette.gradient.main,
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, " +
              "linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            pointerEvents: "none",
            transition: "all 0.2s ease-in-out",
          },
          "&:hover": {
            "&::before": {
              padding: "2px",
            },
          },
          ...sx,
        }}
        {...buttonProps}
      >
        {text}
      </Button>
    </>
  );
};
