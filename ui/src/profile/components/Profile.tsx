import { Divider, Stack, Typography, useTheme } from "@mui/material";
import { useProfile } from "../../auth/hooks/use-profile";
import { GradientCircularProgress } from "../../components/GradientCircularProgress";
import { PostsFeed } from "../../posts/components/PostsFeed";
import { UserData } from "./UserData";
import { Navigate } from "react-router-dom";
import { RouteTab } from "../../enums";
import { PostsOrigin } from "../../store/posts";

type Props = {
  profileId: string;
  ownProfile?: boolean;
};

export const Profile = ({ profileId, ownProfile = false }: Props) => {
  const { user, isLoadingProfile } = useProfile(profileId);
  const theme = useTheme();

  return isLoadingProfile ? (
    <GradientCircularProgress />
  ) : user ? (
    <Stack alignItems={"center"} gap={2} width={"50%"}>
      <UserData user={user} />
      <Divider sx={{ width: "100%" }}>
        <Typography sx={{ color: theme.palette.grey[500] }}>POSTS</Typography>
      </Divider>
      <PostsFeed
        origin={ownProfile ? PostsOrigin.USER : PostsOrigin.PROFILE}
        profileId={user._id}
      />
    </Stack>
  ) : (
    <Navigate to={RouteTab.NOT_FOUND} />
  );
};
