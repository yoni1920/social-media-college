import { Stack } from "@mui/material";
import { PostsFeed } from "../../posts/PostsFeed";
import { useProfile } from "../../auth/hooks/use-profile";
import { UserData } from "./UserData/UserData";
type Props = {
  profileId: string;
};
export const Profile = ({ profileId }: Props) => {
  const user = useProfile(profileId);
  return (
    <Stack>
      <UserData user={user} />
      <PostsFeed profileId={user?._id} />
    </Stack>
  );
};
