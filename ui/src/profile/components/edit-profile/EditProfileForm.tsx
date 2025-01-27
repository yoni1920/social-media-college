import { Stack, TextField, Typography } from "@mui/material";
import { isAxiosError } from "axios";
import {
  ChangeEvent,
  FocusEvent,
  FormEvent,
  useCallback,
  useMemo,
  useState,
} from "react";
import { FormSubmitButton } from "../../../components/FormSubmitButton";
import { User } from "../../../types";
import { DEFAULT_PROFILE_URL } from "../../constants";
import { handleUpdateProfile } from "../../utils";
import { UpdateProfilePicture } from "./UpdateProfilePicture";

type EditProfileDetails = {
  username: string;
  bio: string;
  name: string;
};

type EditProfileErrors = Record<
  keyof EditProfileDetails,
  { error: boolean; message: string }
>;

type Props = {
  user: User;
  onUpdateSuccess: () => void;
};

export const EditProfileForm = ({ user, onUpdateSuccess }: Props) => {
  const [profileData, setProfileData] = useState<EditProfileDetails>({
    username: user.username,
    bio: user.bio,
    name: user.name ?? "",
  });

  const [profileDataErrors, setProfileDataErrors] = useState<EditProfileErrors>(
    {
      bio: { error: false, message: "" },
      username: { error: false, message: "" },
      name: { error: false, message: "" },
    }
  );

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const onTextFieldChange = useCallback(
    <T extends keyof EditProfileDetails>(
        field: T,
        options?: { notEmpty?: boolean }
      ) =>
      (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.currentTarget?.value;

        setProfileData((prev) => ({
          ...prev,
          [field]: value,
        }));

        if (options?.notEmpty && !value) {
          setProfileDataErrors((prev) => ({
            ...prev,
            [field]: { error: true, message: "Field should not be empty" },
          }));
        } else {
          setProfileDataErrors((prev) => ({
            ...prev,
            [field]: { error: false, message: "" },
          }));
        }
      },
    []
  );

  const onChosePicture = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    console.log(event);
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

  const highlightOnClick = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      event.target.select();
    },
    []
  );

  const isRemovingProfilePicture = useMemo(() => {
    if (user.picture === DEFAULT_PROFILE_URL) {
      return false;
    }

    return !profilePicture && previewUrl === DEFAULT_PROFILE_URL;
  }, [previewUrl, profilePicture, user.picture]);

  const changedFields = useMemo(
    () =>
      Object.entries(profileData).filter(([field, value]) => {
        const userField = field as keyof EditProfileDetails;

        return user[userField] !== value;
      }),
    [profileData, user]
  );

  const canSubmitUpdate = useMemo(() => {
    if (profilePicture || isRemovingProfilePicture) {
      return true;
    }

    return Boolean(changedFields.length);
  }, [profilePicture, changedFields, isRemovingProfilePicture]);

  const onUpdateError = useCallback((error: Error) => {
    if (isAxiosError(error)) {
      const message = error.response?.data.message as string | undefined;

      if (message && message.includes("username")) {
        setProfileDataErrors((prev) => ({
          ...prev,
          username: { error: true, message },
        }));
      } else if (message) {
        setGeneralError(message);
      }
    } else {
      console.error({
        message: "error occurred on login",
        request: "login",
        stack: (error as Error)?.stack,
        errMessage: (error as Error).message,
      });
    }
  }, []);

  const onSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      const formData = new FormData();

      if (profilePicture) {
        formData.append("image", profilePicture);
      }

      changedFields.forEach(([field, value]) => formData.append(field, value));

      if (isRemovingProfilePicture) {
        formData.append("removePicture", "true");
      }

      setGeneralError(null);

      await handleUpdateProfile(user._id, formData, {
        onSuccess: onUpdateSuccess,
        onError: onUpdateError,
      });
    },
    [
      onUpdateSuccess,
      changedFields,
      profilePicture,
      user._id,
      onUpdateError,
      isRemovingProfilePicture,
    ]
  );

  return (
    <form
      onSubmit={onSubmit}
      style={{
        width: "100%",
      }}
    >
      <Stack width={"100%"} alignItems={"center"} gap={6}>
        <UpdateProfilePicture
          user={user}
          onChosePicture={onChosePicture}
          previewUrl={previewUrl}
          onRemovePicture={onRemovePicture}
        />

        <Stack gap={2} width={"100%"} alignItems={"center"}>
          <TextField
            variant="filled"
            value={profileData.username}
            onChange={onTextFieldChange("username", { notEmpty: true })}
            label="Username"
            size="small"
            error={profileDataErrors.username.error}
            helperText={profileDataErrors.username.message}
            onFocus={highlightOnClick}
            sx={{ width: "60%" }}
          />

          <TextField
            variant="filled"
            value={profileData.name}
            onChange={onTextFieldChange("name")}
            label="Name"
            size="small"
            error={profileDataErrors.name.error}
            helperText={profileDataErrors.name.message}
            onFocus={highlightOnClick}
            sx={{ width: "60%" }}
          />

          <TextField
            variant="filled"
            value={profileData.bio}
            onChange={onTextFieldChange("bio")}
            label="Bio"
            size="small"
            error={profileDataErrors.bio.error}
            helperText={profileDataErrors.bio.message}
            onFocus={highlightOnClick}
            sx={{ width: "60%" }}
          />
        </Stack>

        {generalError ? (
          <Typography color="error" fontSize={"small"}>
            {generalError}
          </Typography>
        ) : null}

        <FormSubmitButton disabled={!canSubmitUpdate} text="Update" />
      </Stack>
    </form>
  );
};
