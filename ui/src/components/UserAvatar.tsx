import { Avatar } from "@mui/material";

type Props = {
  name?: string;
  picture?: string;
};
export const UserAvatar = ({ name, picture }: Props) => {
  return (
    <Avatar
      alt={name ?? ""}
      src={picture ?? ""}
      sx={{ width: 36, height: 36 }}
    />
  );
};
