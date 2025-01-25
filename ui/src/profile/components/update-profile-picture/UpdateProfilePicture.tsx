import { Avatar, Button, Stack, Typography } from "@mui/material";
import { ChangeEvent } from "react";
import { User } from "../../../types";

type Props = {
  user: User | null;
  onChosePicture: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemovePicture: () => void;
  previewUrl: string | null;
};

export const UpdateProfilePicture = ({
  user,
  onChosePicture,
  onRemovePicture,
  previewUrl,
}: Props) => {
  return (
    <Stack direction={"row"} gap={4} alignItems={"center"}>
      <Avatar
        src={previewUrl ?? user?.picture}
        alt={user?.name}
        sx={{ height: 96, width: 96 }}
      />

      <Stack gap={1.5} alignItems={"center"}>
        <input
          color="primary"
          accept="image/png, image/webp, image/jpeg"
          type="file"
          onChange={onChosePicture}
          id="update-profile-picture"
          style={{ display: "none" }}
        />
        <label htmlFor="update-profile-picture">
          <Button
            variant="contained"
            component="span"
            sx={{
              paddingX: "1rem",
              paddingY: "0.7rem",
            }}
            color="primary"
          >
            <Typography sx={{ fontSize: "0.8rem" }} fontWeight={"500"}>
              Update Picture
            </Typography>
          </Button>
        </label>

        <Button
          onClick={onRemovePicture}
          color="error"
          variant="contained"
          sx={{
            width: "90%",
          }}
        >
          <Typography sx={{ fontSize: "0.6rem" }} fontWeight={"500"}>
            Remove Picture
          </Typography>
        </Button>
      </Stack>
    </Stack>
  );
};
