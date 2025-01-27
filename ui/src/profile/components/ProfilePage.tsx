import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../auth/hooks/use-auth";
import { Profile } from "./Profile";
import { RouteTab } from "../../enums";

export const ProfilePage = () => {
  const {
    user: { _id: ownUserId },
  } = useUser();
  const { id } = useParams();

  const navigate = useNavigate();
  const shouldOpenOwnProfile = !id || id === ownUserId;

  if (shouldOpenOwnProfile) {
    navigate(RouteTab.USER_PROFILE);

    return null;
  }

  return <Profile profileId={id} />;
};
