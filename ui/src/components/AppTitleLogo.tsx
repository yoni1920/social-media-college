import { Box } from "@mui/material";
import appLogo from "../images/AppTitleLogo.png";

export const AppTitleLogo = () => {
  return (
    <Box component={"img"} src={appLogo} alt="App Title Logo" width={"50%"} />
  );
};
