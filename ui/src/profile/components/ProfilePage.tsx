import { useParams } from "react-router-dom";
import { useUser } from "../../auth/hooks/use-auth";
import { Profile } from "./Profile";

export const ProfilePage = () => {
  const { id } = useParams();
  const { _id: ownUserId } = useUser();
  return <Profile profileId={id || ownUserId} />;
};
