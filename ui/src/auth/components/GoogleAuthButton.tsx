import { Button, Typography } from "@mui/material";
import { GoogleIcon } from "../../components/GoogleIcon";

export const GoogleAuthButton = () => {
  const handleGoogleAuth = () => {
    window.location.href = `${import.meta.env.VITE_SERVER_URL}/auth/google`;
  };

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
      onClick={handleGoogleAuth}
    >
      <Typography fontSize={"small"} fontWeight={400}>
        Log in with Google
      </Typography>
    </Button>
  );
};
