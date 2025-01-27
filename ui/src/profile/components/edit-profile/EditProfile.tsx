import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button, Stack, Typography } from "@mui/material";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../auth/hooks/use-auth";
import { AppCard } from "../../../components/AppCard";
import { RouteTab } from "../../../enums";
import { EditProfileForm } from "./EditProfileForm";

export const EditProfile = () => {
  const navigate = useNavigate();
  const { user, refreshSelfUser } = useUser();

  const returnToProfile = useCallback(() => {
    navigate(RouteTab.USER_PROFILE);
  }, [navigate]);

  const onUpdateSuccess = useCallback(async () => {
    await refreshSelfUser();

    returnToProfile();
  }, [refreshSelfUser, returnToProfile]);

  return (
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

        <EditProfileForm user={user} onUpdateSuccess={onUpdateSuccess} />
      </Stack>
    </AppCard>
  );
};
