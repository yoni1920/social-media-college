import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button, Stack, Typography } from "@mui/material";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { profileApi } from "../../../api/profile-api";
import { ConfirmationDialog } from "../../../auth/components/ConfirmationDialog";
import { useUser } from "../../../auth/hooks/use-auth";
import { AppCard } from "../../../components/AppCard";
import { RouteTab } from "../../../enums";
import { EditProfileForm } from "./EditProfileForm";

export const EditProfile = () => {
  const navigate = useNavigate();
  const { user, refreshSelfUser } = useUser();

  const [isDeleteDialogShown, setIsDeleteDialogShown] = useState(false);

  const returnToProfile = useCallback(() => {
    navigate(RouteTab.USER_PROFILE);
  }, [navigate]);

  const onUpdateSuccess = useCallback(async () => {
    await refreshSelfUser();

    returnToProfile();
  }, [refreshSelfUser, returnToProfile]);

  const deleteUser = useCallback(async () => {
    await profileApi.delete(user._id);
    setIsDeleteDialogShown(false);

    navigate(RouteTab.HOME);
  }, [user._id, navigate]);

  const onDeleteUserClick = useCallback(() => {
    setIsDeleteDialogShown(true);
  }, []);

  return (
    <>
      <AppCard sx={{ mt: 5 }}>
        <Stack alignItems={"center"} mb={5} mt={3} gap={4}>
          <Stack width={"100%"} alignItems={"center"}>
            <Button
              onClick={returnToProfile}
              startIcon={<ArrowBackIcon />}
              sx={{ alignSelf: "flex-start", ml: 5 }}
            >
              To Profile
            </Button>

            <Typography variant="h5">Edit Profile</Typography>
          </Stack>

          <EditProfileForm
            user={user}
            onUpdateSuccess={onUpdateSuccess}
            onDeleteUser={onDeleteUserClick}
          />
        </Stack>
      </AppCard>

      <ConfirmationDialog
        open={isDeleteDialogShown}
        close={() => {
          setIsDeleteDialogShown(false);
        }}
        title="Delete user?"
        content="Are you sure you want to delete your user?"
        onConfirm={deleteUser}
        confirmText="Delete"
      />
    </>
  );
};
