import { Stack } from "@mui/material";
import { useProfile } from "../../auth/hooks/use-profile";
import { GradientCircularProgress } from "../../components/GradientLoader";
import { PostsFeed } from "../../posts/PostsFeed";
import { UserData } from "./user-data/UserData";
import { Navigate } from "react-router-dom";
import { RouteTab } from "../../enums";
type Props = {
  profileId: string;
};

export const Profile = ({ profileId }: Props) => {
  const { user, isLoadingProfile } = useProfile(profileId);

  return isLoadingProfile ? (
    <GradientCircularProgress />
  ) : user ? (
    <Stack>
      <UserData user={user} />
      <PostsFeed profileId={user._id} />
    </Stack>
  ) : (
    <Navigate to={RouteTab.NOT_FOUND} />
  );
};
