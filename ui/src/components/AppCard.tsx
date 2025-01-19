import { Paper, PaperProps } from "@mui/material";
import { PropsWithChildren } from "react";

export const AppCard = ({
  children,
  sx,
  ...paperProps
}: PropsWithChildren<PaperProps>) => {
  return (
    <Paper
      elevation={4}
      variant="elevation"
      sx={{
        width: "600px",
        ...sx,
      }}
      {...paperProps}
    >
      {children}
    </Paper>
  );
};
