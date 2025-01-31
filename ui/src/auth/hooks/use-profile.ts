import { useEffect, useState } from "react";
import { profileApi } from "../../api/profile-api";
import { User } from "../../types";

export const useProfile = (profileId: string) => {
  const [user, setUser] = useState<User>();
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    setIsLoadingProfile(true);

    profileApi.get(profileId).then(({ data }) => {
      setIsLoadingProfile(false);
      setUser(data);
    });
  }, [profileId]);

  return { user, isLoadingProfile };
};
