import { CircularProgress, CircularProgressProps } from "@mui/material";
import { APP_GRADIENT_ID, AppGradient } from "./AppGradient";

export const GradientCircularProgress = ({
  sx,
  ...progressProps
}: CircularProgressProps) => {
  return (
    <>
      <AppGradient />
      <CircularProgress
        size={"6rem"}
        sx={{
          "svg circle": { stroke: `url(#${APP_GRADIENT_ID})` },
          ...sx,
        }}
        {...progressProps}
      />
    </>
  );
};
