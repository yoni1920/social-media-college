import { profileApi } from "../../api/profile-api";
import { User } from "../../types";

export const handleUpdateProfile = async (
  userID: User["_id"],
  formData: FormData,
  {
    onSuccess,
    onError,
  }: {
    onSuccess: () => void;
    onError: (error: Error) => void;
  }
) => {
  try {
    await profileApi.putForm(`/${userID}`, formData);

    onSuccess();
  } catch (error) {
    onError(error as Error);
  }
};
