import { Stack } from "@mui/material";
import { useProfile } from "../../auth/hooks/use-profile";
import { GradientCircularProgress } from "../../components/GradientLoader";
import { PostsFeed } from "../../posts/PostsFeed";
import { UserData } from "./UserData/UserData";
type Props = {
  profileId: string;
};

export const Profile = ({ profileId }: Props) => {
  const { user, isLoadingProfile } = useProfile(profileId);

  return isLoadingProfile ? (
    <GradientCircularProgress />
  ) : (
    <Stack>
      <UserData user={user} />
      <PostsFeed profileId={user?._id} />
    </Stack>
  );
};
