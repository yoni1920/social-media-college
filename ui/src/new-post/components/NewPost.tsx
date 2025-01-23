import { Button, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { TPost } from "../../types/post";
import { useAuth } from "../../auth/hooks/use-auth";
import { postsApi } from "../../api/posts-api";
import { LoadingButton } from "../../components/LoadingButton";
import { useNavigate } from "react-router-dom";
import { RouteTab } from "../../enums";

export const NewPost = () => {
  const { user } = useAuth();
  const [post, setPost] = useState<Partial<TPost>>({
    message: "",
    sender: user?._id,
  });

  const navigate = useNavigate();

  const onSubmit = async () => {
    await postsApi.post("/", post);
    navigate(RouteTab.HOME);
  };
  return (
    <Stack justifyContent="center" alignItems="center">
      <TextField
        value={post.message}
        placeholder="What's on your mind?"
        onChange={(event) =>
          setPost((currentData) => ({
            ...currentData,
            message: event.target.value,
          }))
        }
      />
      <LoadingButton onClick={onSubmit}>Upload</LoadingButton>
    </Stack>
  );
};
