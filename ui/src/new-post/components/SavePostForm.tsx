import { Button, Card, CardActions, Stack, TextField } from "@mui/material";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postsApi } from "../../api/posts-api";
import { useAuth } from "../../auth/hooks/use-auth";
import { LoadingButton } from "../../components/LoadingButton";
import { RouteTab } from "../../enums";
import { TPost } from "../../types/post";

type Props = {
  post?: Partial<TPost>;
  onSuccess?: () => void;
};

export const SavePostForm = ({
  post: { _id, ...initialPost } = {},
  onSuccess,
}: Props) => {
  const { user } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [post, setPost] = useState<
    Partial<Omit<TPost, "sender"> & { sender: string }>
  >(
    Object.assign(initialPost ?? {}, {
      sender: user?._id,
    })
  );
  const [file, setFile] = useState<File | null>();

  const navigate = useNavigate();
  const onFileChosen = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const onSubmit = async () => {
    if ((!file && !_id) || !post.message) {
      return;
    }

    const formData = new FormData();
    if (file) {
      formData.append("image", file);
    }
    formData.append("message", post.message);
    formData.append("sender", post.sender ?? "");
    await postsApi[_id ? "putForm" : "postForm"](
      `/${_id ? _id : ""}`,
      formData
    );
    if (onSuccess) {
      return onSuccess();
    }

    navigate(RouteTab.HOME);
  };
  return (
    <Card>
      <Stack alignItems="center" justifyContent="center" gap={2}>
        {file && (
          <img
            src={URL.createObjectURL(file)}
            alt="preview"
            width="300px"
            height="300px"
          />
        )}
        <CardActions>
          <Button
            color={file === null ? "error" : "primary"}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              style={{ display: "none" }}
              accept="image/*"
              multiple={false}
              onChange={onFileChosen}
            />
            {file ? file.name : "Choose Image"}
          </Button>
        </CardActions>
        <TextField
          value={post.message}
          error={post.message === ""}
          sx={{ width: "100%", paddingInline: 1 }}
          placeholder="What's on your mind?"
          multiline
          onChange={(event) =>
            setPost((currentData) => ({
              ...currentData,
              message: event.target.value,
            }))
          }
          helperText={post.message === "" ? "Message is required" : ""}
        />
        <LoadingButton onClick={onSubmit}>Upload</LoadingButton>
      </Stack>
    </Card>
  );
};
