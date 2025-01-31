import EditNoteIcon from "@mui/icons-material/EditNote";
import { Button, Card, CardContent, Stack, Typography } from "@mui/material";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../auth/hooks/use-auth";
import { UserAvatar } from "../../../components/UserAvatar";
import { RouteTab } from "../../../enums";
import { User } from "../../../types";

type Props = { user: User };

export const UserData = ({ user }: Props) => {
  const {
    user: { _id: selfUserId },
  } = useUser();

  const navigate = useNavigate();

  const canEditProfile = useMemo(
    () => user._id === selfUserId,
    [user._id, selfUserId]
  );

  const onEditProfileClick = useCallback(() => {
    navigate(RouteTab.EDIT_PROFILE);
  }, [navigate]);

  return (
    <Card
      sx={{
        mt: 5,
        width: "fit-content",
        maxWidth: "750px",
        boxShadow: "3",
        height: "fit-content",
      }}
    >
      <CardContent>
        <Stack gap={4} mb={1}>
          {canEditProfile ? (
            <Button
              size="small"
              variant="contained"
              onClick={onEditProfileClick}
              endIcon={<EditNoteIcon />}
              sx={{ alignSelf: "flex-end", mr: 2, mt: 1 }}
            >
              <Typography fontSize={"small"}>Edit profile</Typography>
            </Button>
          ) : null}

          <Stack
            direction="row"
            alignItems="center"
            gap={4}
            paddingRight={12}
            paddingLeft={6}
          >
            <UserAvatar user={user} sx={{ width: 120, height: 120 }} />

            <Stack alignItems={"center"} gap={2}>
              <Typography fontWeight={"light"} fontSize={"large"}>
                @{user.username}
              </Typography>

              <Stack alignItems={"center"}>
                <Typography fontWeight={"bold"}>{user.name}</Typography>

                <Button
                  variant="text"
                  size="small"
                  onClick={() => {
                    window.location.href = `mailto:${user.email}`;
                  }}
                >
                  {user.email}
                </Button>
              </Stack>

              <Typography>{user.bio}</Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
