import { useUser } from "../../auth/hooks/use-auth";
import { Profile } from "./Profile";

export const UserProfile = () => {
  const { _id: ownUserId } = useUser();

  return <Profile profileId={ownUserId} />;
};
