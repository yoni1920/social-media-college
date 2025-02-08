import { Edit, Delete } from "@mui/icons-material";
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
  onEditPost: () => void;
  onDeletePost: () => void;
};
export const OwnPostsActionsMenu = ({
  open = true,
  anchorEl,
  handleClose,
  onDeletePost,
  onEditPost,
}: Props) => {
  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      role={undefined}
      placement="bottom"
      transition
      disablePortal
    >
      {({ TransitionProps }) => (
        <Grow
          {...TransitionProps}
          style={{
            transformOrigin: "top",
          }}
        >
          <Paper variant="elevation" elevation={2}>
            <ClickAwayListener onClickAway={handleClose}>
              <MenuList autoFocusItem={open}>
                <MenuItem onClick={onEditPost}>
                  <ListItemIcon>
                    <Edit fontSize="medium" />
                  </ListItemIcon>
                  <ListItemText>Edit Post</ListItemText>
                </MenuItem>

                <MenuItem onClick={onDeletePost}>
                  <ListItemIcon>
                    <Delete fontSize="medium" color="error" />
                  </ListItemIcon>
                  <ListItemText
                    sx={(theme) => ({ color: theme.palette.error.main })}
                  >
                    Delete Post
                  </ListItemText>
                </MenuItem>
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
};
