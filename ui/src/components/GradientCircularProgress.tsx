import { CircularProgress, CircularProgressProps, Stack } from "@mui/material";
import { APP_GRADIENT_ID, AppGradient } from "./AppGradient";

export const GradientCircularProgress = ({
  sx,
  ...progressProps
}: CircularProgressProps) => {
  return (
    <Stack my={3}>
      <AppGradient />
      <CircularProgress
        size={"6rem"}
        sx={{
          "svg circle": { stroke: `url(#${APP_GRADIENT_ID})` },
          ...sx,
        }}
        {...progressProps}
      />
    </Stack>
  );
};
