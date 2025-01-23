import {
  AccountCircleOutlined,
  AddCircleOutline,
  HomeOutlined,
} from "@mui/icons-material";
import { Avatar, Tab, Tabs } from "@mui/material";
import { memo } from "react";
import { Link } from "react-router-dom";
import { RouteTab } from "../../enums";
import { useAuth } from "../../auth/hooks/use-auth";

type Props = {
  currentTab: RouteTab | null;
};

export const NavTabs = memo(({ currentTab }: Props) => {
  const { user } = useAuth();

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
        icon={
          <Avatar
            alt={user?.name ?? ""}
            src={user?.picture ?? ""}
            sx={{ width: 36, height: 36 }}
          />
        }
        iconPosition="start"
        label="Profile"
        value={RouteTab.PROFILE}
        to={"/profile"}
        component={Link}
        sx={{
          marginLeft: "12px",
          justifyContent: "flex-start",
          gap: 1,
          fontSize: "1rem",
        }}
      />
    </Tabs>
  );
});
