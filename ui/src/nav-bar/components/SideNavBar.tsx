import { Stack } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import { AppTitleLogo } from "../../components/AppTitleLogo";
import { useCurrentTab } from "../hooks";
import { NavFooter } from "./NavFooter";
import { NavTabs } from "./NavTabs";

const DRAWER_WIDTH = 260;

export const SideNavBar = () => {
  const { currentTab } = useCurrentTab();

  return (
    <Stack>
      <Drawer
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            boxShadow: 3,
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Stack justifyContent={"space-between"} height={"100%"}>
          <Stack gap={8}>
            <Toolbar sx={{ justifyContent: "center", mt: 2 }}>
              <AppTitleLogo
                mt={3}
                sx={{
                  fontSize: 30,
                }}
              />
            </Toolbar>

            <NavTabs currentTab={currentTab} />
          </Stack>

          <NavFooter />
        </Stack>
      </Drawer>
    </Stack>
  );
};
