import {
  AccountCircleOutlined,
  AddCircleOutline,
  HomeOutlined,
} from "@mui/icons-material";
import { Tab, Tabs } from "@mui/material";
import { memo } from "react";
import { Link } from "react-router-dom";
import { RouteTab } from "../../enums";

type Props = {
  currentTab: RouteTab;
};

export const NavTabs = memo(({ currentTab }: Props) => {
  return (
    <Tabs orientation="vertical" variant="scrollable" value={currentTab}>
      <Tab
        icon={<HomeOutlined sx={{ fontSize: "1.8rem" }} />}
        iconPosition="start"
        label="Home"
        value={RouteTab.HOME}
        to={"/home"}
        component={Link}
        sx={{
          justifyContent: "flex-start",
          marginLeft: 2,
          gap: 1,
          fontSize: "1rem",
        }}
      />
      <Tab
        icon={<AddCircleOutline sx={{ fontSize: "1.8rem" }} />}
        iconPosition="start"
        label="New Post"
        value={RouteTab.NEW_POST}
        to={"/new-post"}
        component={Link}
        sx={{
          justifyContent: "flex-start",
          marginLeft: 2,
          gap: 1,
          fontSize: "1rem",
        }}
      />
      <Tab
        icon={<AccountCircleOutlined sx={{ fontSize: "1.8rem" }} />}
        iconPosition="start"
        label="Profile"
        value={RouteTab.PROFILE}
        to={"/profile"}
        component={Link}
        sx={{
          justifyContent: "flex-start",
          marginLeft: 2,
          gap: 1,
          fontSize: "1rem",
        }}
      />
    </Tabs>
  );
});
