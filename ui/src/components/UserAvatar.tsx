import { Avatar, AvatarProps } from "@mui/material";
import { useMemo } from "react";
import { User } from "../types";

type Props = {
  user: User | Pick<User, "picture" | "name" | "username" | "_id"> | null;
  sx?: AvatarProps["sx"];
  previewUrl?: string | null;
};

export const UserAvatar = ({ user, sx, previewUrl }: Props) => {
  const pictureSrc = useMemo(() => {
    if (previewUrl) {
      return previewUrl;
    }

    if (!user?.picture) {
      return "";
    }

    return `${import.meta.env.VITE_SERVER_URL}/users/image/${
      user._id
    }?fileName=${user.picture}`;
  }, [user?._id, user?.picture, previewUrl]);

  return (
    <Avatar
      alt={user?.username ?? ""}
      src={pictureSrc}
      sx={{ width: 36, height: 36, ...sx }}
    />
  );
};
