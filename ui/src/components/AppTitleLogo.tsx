import { Typography } from "@mui/material";

export const AppTitleLogo = () => {
  return (
    <Typography
      paddingY={1}
      variant="h3"
      fontWeight={"bold"}
      fontFamily={"Playwrite IN"}
      sx={{
        background: "linear-gradient(90deg, #1976d2, #4caf50)",
        color: "transparent",
        backgroundClip: "text",
      }}
    >
      WeSocial.io
    </Typography>
  );
};
