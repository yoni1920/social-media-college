import { Stack, Typography } from "@mui/material";
import { SavePostForm } from "./SavePostForm";
import { SavePostMode } from "../../posts/enums/save-post-mode.enum";

export const NewPost = () => {
  return (
    <Stack mt={8} alignItems={"center"} height={"100%"} width={"100%"}>
      <SavePostForm
        title={
          <Typography variant="h5" fontWeight={"light"}>
            Upload New Post
          </Typography>
        }
        elevation={4}
        savePostMode={SavePostMode.CREATE}
      />
    </Stack>
  );
};
