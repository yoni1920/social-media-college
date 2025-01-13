import { Paper } from "@mui/material";
import { SignIn } from "./SignIn";
import { Registration } from "./Registration";

export const Authentication = () => {
  return (
    <Paper
      elevation={4}
      variant="elevation"
      sx={{
        width: "600px",
      }}
    >
      {/* <SignIn /> */}
      <Registration />
    </Paper>
  );
};
