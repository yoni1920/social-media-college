import MenuIcon from "@mui/icons-material/Menu";
import { Button, Stack } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { useAuth } from "../../auth/hooks/use-auth";
import { MoreOptionsMenu } from "./MoreOptionsMenu";

export const NavFooter = () => {
  const { logout } = useAuth();
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setMenuAnchorEl(null);
  }, []);

  const open = useMemo(() => Boolean(menuAnchorEl), [menuAnchorEl]);

  return (
    <Stack mb={5} alignItems={"center"}>
      <Button
        startIcon={<MenuIcon />}
        onClick={handleClick}
        sx={({ palette }) => ({
          justifyContent: "flex-start",
          color: open ? palette.primary.main : palette.grey[700],
          paddingY: "1rem",
          width: "80%",
          fontSize: "1rem",

          "& .MuiButton-startIcon": {
            marginRight: 2,
            "& svg": {
              fontSize: "1.8rem",
            },
          },
        })}
      >
        More
      </Button>

      <MoreOptionsMenu
        open={open}
        handleClose={handleClose}
        anchorEl={menuAnchorEl}
        onLogout={logout}
      />
    </Stack>
  );
};
