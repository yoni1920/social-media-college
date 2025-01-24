import { Button, Stack, TextField } from "@mui/material";
import React, { useRef, useState } from "react";
import { TPost } from "../../types/post";
import { useAuth } from "../../auth/hooks/use-auth";
import { LoadingButton } from "../../components/LoadingButton";
import { useNavigate } from "react-router-dom";
import { postsApi } from "../../api/posts-api";
import { RouteTab } from "../../enums";

export const NewPost = () => {
  const { user } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [post, setPost] = useState<
    Partial<Omit<TPost, "sender"> & { sender: string }>
  >({
    sender: user?._id,
  });
  const [file, setFile] = useState<File | null>();

  const navigate = useNavigate();
  const onFileChosen = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event);
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const onSubmit = async () => {
    if (!file || !post.message) {
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("message", post.message);
    formData.append("sender", post.sender ?? "");
    await postsApi.post("/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    navigate(RouteTab.HOME);
  };
  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      onSubmit={onSubmit}
      gap={3}>
      <TextField
        value={post.message}
        error={post.message === ""}
        placeholder="What's on your mind?"
        onChange={(event) =>
          setPost((currentData) => ({
            ...currentData,
            message: event.target.value,
          }))
        }
        helperText={post.message === "" ? "Message is required" : ""}
      />
      {file && (
        <img
          src={URL.createObjectURL(file)}
          alt="preview"
          style={{ maxWidth: "100%" }}
        />
      )}
      <Button
        color={file === null ? "error" : "primary"}
        onClick={() => inputRef.current?.click()}>
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
      <LoadingButton onClick={onSubmit}>Upload</LoadingButton>
    </Stack>
  );
};
