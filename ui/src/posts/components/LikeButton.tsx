import { FavoriteBorderOutlined, Favorite } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useEffect, useState } from "react";

type Props = {
  liked: boolean;
  onLiked: () => void;
  initiallyLiked?: boolean;
};

const ICON_SIZE = "1.5rem";

export const LikeButton = ({
  liked,
  onLiked,
  initiallyLiked = false,
}: Props) => {
  const [canAnimateLike, setCanAnimateLike] = useState(!initiallyLiked);

  useEffect(() => {
    if (!liked && !canAnimateLike) {
      setCanAnimateLike(true);
    }
  }, [canAnimateLike, liked]);

  return (
    <IconButton
      disableRipple
      onClick={onLiked}
      sx={{
        "&:hover": {
          color: "black",
        },
        ...(liked && canAnimateLike && { animation: "like-pulse .30s" }),
      }}
    >
      {liked ? (
        <Favorite
          sx={{
            color: "#fc032c",
            fontSize: ICON_SIZE,
          }}
        />
      ) : (
        <FavoriteBorderOutlined sx={{ fontSize: ICON_SIZE }} />
      )}
    </IconButton>
  );
};
