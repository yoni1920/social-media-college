import { Paper } from "@mui/material";
import { PropsWithChildren } from "react";

export const AuthCard = ({ children }: PropsWithChildren) => {
  return (
    <Paper
      elevation={4}
      variant="elevation"
      sx={{
        width: "600px",
      }}
    >
      {children}
    </Paper>
  );
};
