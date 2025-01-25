import {
  Button,
  Card,
  CardActions,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { User } from "../../../types";
import { UserAvatar } from "../../../components/UserAvatar";
import { useUser } from "../../../auth/hooks/use-auth";

type Props = { user?: User };

export const UserData = ({ user }: Props) => {
  const { _id: selfUserId } = useUser();

  if (!user) return;

  console.log(user);

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

      {user._id === selfUserId ? (
        <CardActions>
          <Button size="small" variant="text">
            Edit profile
          </Button>
          <Button size="small" variant="text">
            Delete profile
          </Button>
        </CardActions>
      ) : null}
    </Card>
  );
};
