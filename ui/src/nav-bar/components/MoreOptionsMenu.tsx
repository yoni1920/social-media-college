import { MeetingRoom } from "@mui/icons-material";
import {
  ClickAwayListener,
  Grow,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from "@mui/material";

type Props = {
  open?: boolean;
  anchorEl?: HTMLElement | null;
  handleClose: () => void;
  onLogout: () => Promise<void>;
};
export const MoreOptionsMenu = ({
  open = true,
  anchorEl,
  handleClose,
  onLogout,
}: Props) => {
  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      role={undefined}
      placement="top"
      transition
      disablePortal
      sx={{
        width: "80%",
      }}
    >
      {({ TransitionProps }) => (
        <Grow
          {...TransitionProps}
          style={{
            transformOrigin: "bottom",
          }}
        >
          <Paper variant="elevation" elevation={2}>
            <ClickAwayListener onClickAway={handleClose}>
              <MenuList autoFocusItem={open}>
                <MenuItem onClick={onLogout}>
                  <ListItemIcon>
                    <MeetingRoom fontSize="medium" />
                  </ListItemIcon>
                  <ListItemText>Logout</ListItemText>
                </MenuItem>
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
};
