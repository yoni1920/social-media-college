import { Avatar, Button, Stack, Typography } from "@mui/material";
import { useAuth } from "../../auth/hooks/use-auth";
import { AppCard } from "../../components/AppCard";

import { UpdateProfilePicture } from "./update-profile-picture/UpdateProfilePicture";
import { ChangeEvent, useCallback, useRef, useState } from "react";
import { DEFAULT_PROFILE_URL } from "../constants";

type EditProfileDetails = {
  username: string;
  bio: string;
};

export const EditProfile = () => {
  const { user } = useAuth();

  const [profileData, setProfileData] = useState<EditProfileDetails>({
    username: "",
    bio: "",
  });

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState("");

  const onTextFieldChange = useCallback(
    <T extends keyof EditProfileDetails>(field: T) =>
      (event: ChangeEvent<HTMLInputElement>) => {
        setProfileData((prev) => ({
          ...prev,
          [field]: event.currentTarget.value,
        }));
      },
    []
  );

  const onChosePicture = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setProfilePicture(file);

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  }, []);

  const onRemovePicture = useCallback(() => {
    setPreviewUrl(DEFAULT_PROFILE_URL);
    setProfilePicture(null);
  }, []);

  return (
    <AppCard sx={{ mt: 4 }}>
      <Stack alignItems={"center"} my={3} gap={4}>
        <Typography variant="h5">Edit Profile</Typography>

        <Stack>
          <UpdateProfilePicture
            user={user}
            onChosePicture={onChosePicture}
            previewUrl={previewUrl}
            onRemovePicture={onRemovePicture}
          />
        </Stack>
      </Stack>
    </AppCard>
  );
};
