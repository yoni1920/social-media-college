import {
  Avatar,
  Button,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useAuth } from "../../auth/hooks/use-auth";
import { AppCard } from "../../components/AppCard";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

export const Profile = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();

  const onEditProfile = useCallback(() => {
    navigate("/edit-profile");
  }, [navigate]);

  return (
    <AppCard
      sx={{ mt: 2, width: "auto", minWidth: "600px", maxWidth: "1000px" }}
    >
      <Stack my={3} mx={4}>
        <Stack
          direction={"row"}
          gap={4}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Avatar
            src={user?.picture}
            alt={user?.name}
            sx={{ height: 120, width: 120 }}
          />

          <Stack alignItems={"center"} gap={1}>
            <Typography variant="h5" noWrap>
              {user?.username}
            </Typography>

            <Stack alignItems={"center"}>
              <Typography fontWeight={"light"}>@{user?.name}</Typography>
              <Typography variant="body1">{user?.bio}</Typography>
            </Stack>
          </Stack>

          <Tooltip title="Edit profile" arrow onClick={onEditProfile}>
            <IconButton sx={{ mb: "auto" }}>
              <EditNoteIcon
                fontSize="large"
                sx={{
                  color: theme.palette.primary.main,
                }}
              />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </AppCard>
  );
};
