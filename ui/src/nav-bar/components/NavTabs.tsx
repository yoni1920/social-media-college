import { AddCircleOutline, HomeOutlined } from "@mui/icons-material";
import { Tab, Tabs } from "@mui/material";
import { memo } from "react";
import { Link } from "react-router-dom";
import { UserAvatar } from "../../components/UserAvatar";
import { RouteTab } from "../../enums";
import { User } from "../../types";

type Props = {
  currentTab: RouteTab | null;
  user: User | null;
};

const SHOWN_TABS = [RouteTab.HOME, RouteTab.NEW_POST, RouteTab.USER_PROFILE];

export const NavTabs = memo(({ currentTab, user }: Props) => {
  return (
    <>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={
          currentTab && SHOWN_TABS.includes(currentTab) ? currentTab : false
        }
      >
        <Tab
          icon={<HomeOutlined sx={{ fontSize: "1.8rem" }} />}
          iconPosition="start"
          label="Home"
          value={RouteTab.HOME}
          to={RouteTab.HOME}
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
          to={RouteTab.NEW_POST}
          component={Link}
          sx={{
            justifyContent: "flex-start",
            marginLeft: 2,
            gap: 1,
            fontSize: "1rem",
          }}
        />
        <Tab
          icon={<UserAvatar user={user} />}
          iconPosition="start"
          label="Profile"
          value={RouteTab.USER_PROFILE}
          to={RouteTab.USER_PROFILE}
          component={Link}
          sx={{
            marginLeft: 1.5,
            justifyContent: "flex-start",
            gap: 2,
            fontSize: "1rem",
          }}
        />
      </Tabs>
    </>
  );
});
