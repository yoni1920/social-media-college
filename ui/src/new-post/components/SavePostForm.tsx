import { Button, Card, CardProps, Stack, TextField } from "@mui/material";
import React, {
  ChangeEvent,
  ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { postsApi } from "../../api/posts-api";
import { useAuth } from "../../auth/hooks/use-auth";
import { FormSubmitButton } from "../../components/FormSubmitButton";
import { RouteTab } from "../../enums";
import { TPost } from "../../types/post";

type Props = {
  post?: Partial<TPost>;
  onSuccess?: () => void;
  title?: ReactNode;
  elevation?: CardProps["elevation"];
};

export const SavePostForm = ({
  post: { _id, ...initialPost } = {},
  title,
  onSuccess,
  elevation,
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
  const [isLoadingUpload, setIsLoadingUpload] = useState(false);

  const navigate = useNavigate();
  const onFileChosen = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const onSubmit = useCallback(async () => {
    if (!file && !_id) {
      return;
    }

    const formData = new FormData();
    if (file) {
      formData.append("image", file);
    }
    formData.append("message", post.message ?? "");
    formData.append("sender", post.sender ?? "");

    try {
      setIsLoadingUpload(true);
      await postsApi[_id ? "putForm" : "postForm"](
        `/${_id ? _id : ""}`,
        formData
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingUpload(false);
    }

    if (onSuccess) {
      return onSuccess();
    }

    navigate(RouteTab.HOME);
  }, [_id, file, navigate, onSuccess, post.message, post.sender]);

  const onCaptionChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      setPost((currentData) => ({
        ...currentData,
        message: event.target.value,
      })),
    []
  );

  const canUploadData = useMemo(() => {
    return Boolean(file) || post.message !== initialPost.message;
  }, [file, initialPost.message, post.message]);

  return (
    <Card sx={{ width: "500px" }} elevation={elevation ?? 0}>
      <Stack
        alignItems="center"
        justifyContent="center"
        gap={4}
        mt={2}
        mx={2}
        mb={3}
      >
        {title}
        {file && (
          <img
            src={URL.createObjectURL(file)}
            alt="preview"
            width="350px"
            height="350px"
          />
        )}

        <Stack width={"100%"} alignItems={"center"} gap={2}>
          <Button
            color={file === null ? "error" : "primary"}
            onClick={() => inputRef.current?.click()}
            variant="contained"
            sx={{ width: "10rem" }}
          >
            <input
              ref={inputRef}
              type="file"
              style={{ display: "none" }}
              accept="image/*"
              multiple={false}
              onChange={onFileChosen}
            />
            Choose Image
          </Button>
          <TextField
            value={post.message}
            sx={{ width: "60%" }}
            placeholder="What's on your mind?"
            multiline
            onChange={onCaptionChange}
          />
        </Stack>

        <FormSubmitButton
          onClick={onSubmit}
          text="Upload"
          disabled={!canUploadData}
          loading={isLoadingUpload}
        />
      </Stack>
    </Card>
  );
};
