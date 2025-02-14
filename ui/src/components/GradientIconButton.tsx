import { ButtonProps, IconButton, useTheme } from "@mui/material";
import { ReactNode } from "react";
import { APP_GRADIENT_ID, AppGradient } from "./AppGradient";

type Props = {
  icon: ReactNode;
} & ButtonProps;

export const GradientIconButton = ({ icon, sx, ...buttonProps }: Props) => {
  const { palette } = useTheme();

  return (
    <>
      <AppGradient />
      <IconButton
        sx={{
          svg: {
            fill: `url(#${APP_GRADIENT_ID})`,
            transition: "transform 0.3s ease-in-out",
          },
          borderRadius: "15px",
          border: "none",
          position: "relative",
          transition: "all 0.2s ease-in-out",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            borderRadius: "15px",
            padding: "2px",
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
              padding: "3px",
            },
          },
          ...sx,
        }}
        {...buttonProps}
      >
        {icon}
      </IconButton>
    </>
  );
};
