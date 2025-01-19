import { Stack } from "@mui/material";
import { Outlet } from "react-router-dom";
import { SideNavBar } from "../nav-bar/components/SideNavBar";

export const Layout = () => {
  return (
    <Stack width={"100%"} height={"100%"} alignItems={"inherit"}>
      <SideNavBar />
      <Outlet />
    </Stack>
  );
};
