import { CircularProgress } from "@mui/material";

export const GradientCircularProgress = () => {
  return (
    <>
      <svg width={0} height={0}>
        <defs>
          <linearGradient id="app_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4caf50" />
            <stop offset="100%" stopColor="#1976d2" />
          </linearGradient>
        </defs>
      </svg>
      <CircularProgress
        size={"6rem"}
        sx={{ "svg circle": { stroke: "url(#app_gradient)" } }}
      />
    </>
  );
};
