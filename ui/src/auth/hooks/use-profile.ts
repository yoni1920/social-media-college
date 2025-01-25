import { useEffect, useState } from "react";
import { User } from "../../types";
import { profileApi } from "../../api/profile-api";

export const useProfile = (profileId: string) => {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    profileApi.get(profileId).then(({ data }) => {
      setUser(data);
    });
  }, [profileId]);

  return user;
};
