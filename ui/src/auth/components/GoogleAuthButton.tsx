import { Button, Typography } from "@mui/material";
import { GoogleIcon } from "../../components/GoogleIcon";

export const GoogleAuthButton = () => {
  return (
    <Button
      sx={(theme) => ({
        backgroundColor: "black",
        color: "white",
        padding: "1rem",
        "&:hover": {
          backgroundColor: theme.palette.grey[900],
        },
      })}
      startIcon={<GoogleIcon />}
    >
      <Typography fontSize={"small"} fontWeight={400}>
        Log in with Google
      </Typography>
    </Button>
  );
};
