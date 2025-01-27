import {
  Button,
  Card,
  CardActions,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../../auth/hooks/use-auth";
import { UserAvatar } from "../../../components/UserAvatar";
import { RouteTab } from "../../../enums";
import { User } from "../../../types";

type Props = { user: User };

export const UserData = ({ user }: Props) => {
  const {
    user: { _id: selfUserId },
  } = useUser();

  const canEditProfile = useMemo(
    () => user._id === selfUserId,
    [user._id, selfUserId]
  );

  return (
    <Card>
      <CardContent>
        <Stack direction="row" alignItems="center" gap={1}>
          <UserAvatar name={user.name} picture={user.picture} />
          <Typography>{user.username}</Typography>
        </Stack>
        <Typography>{user.name}</Typography>
        <Typography>{user.bio}</Typography>

        <Button
          variant="text"
          size="small"
          onClick={() => {
            window.location.href = `mailto:${user.email}`;
          }}
        >
          {user.email}
        </Button>
      </CardContent>

      {canEditProfile ? (
        <CardActions>
          <Link to={RouteTab.EDIT_PROFILE}>
            <Button size="small" variant="text">
              Edit profile
            </Button>
          </Link>
          <Button size="small" variant="text">
            Delete profile
          </Button>
        </CardActions>
      ) : null}
    </Card>
  );
};
