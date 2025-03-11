import { Button, Card, CardProps, Stack, TextField } from "@mui/material";
import { isAxiosError } from "axios";
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
import { useUser } from "../../auth/hooks/use-auth";
import { FormSubmitButton } from "../../components/FormSubmitButton";
import { HttpStatus, RouteTab } from "../../enums";
import { MaxCharacterLength } from "../../enums/max-character-length";
import { TPost } from "../../types/post";
import { EnhanceCaptionResponse } from "../types";
import { EnhanceCaptionAction } from "./enhance-caption/EnhanceCaptionAction";
import { TextDirection } from "../../types";

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
  const { user } = useUser();
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
  const [captionError, setCaptionError] = useState<string | null>(null);
  const [enhanceError, setEnhanceError] = useState<string | null>(null);
  const [captionDirection, setCaptionDirection] =
    useState<TextDirection>("ltr");

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
    (event: ChangeEvent<HTMLInputElement>) => {
      setEnhanceError(null);
      const caption = event.target.value;

      if (caption.length > MaxCharacterLength.VERY_LONG) {
        setCaptionError(
          `Caption can only have ${MaxCharacterLength.VERY_LONG} characters`
        );
      } else {
        setCaptionError(null);
      }

      setPost((currentData) => ({
        ...currentData,
        message: event.target.value,
      }));
    },
    []
  );

  const onEnhanceCaptionSuccess = useCallback(
    (
      enhanceResponse: EnhanceCaptionResponse,
      captionDirection?: TextDirection
    ) => {
      if (!enhanceResponse) {
        return;
      }

      if (enhanceResponse.status === "SUCCESS") {
        setEnhanceError(null);

        if (captionDirection) {
          setCaptionDirection(captionDirection);
        }

        setPost((currentData) => ({
          ...currentData,
          message: enhanceResponse.caption,
        }));

        return;
      }

      setEnhanceError(enhanceResponse.reason);
    },
    []
  );

  const onEnhanceCaptionError = useCallback((error: Error) => {
    if (
      isAxiosError(error) &&
      (error.response?.status === HttpStatus.INTERNAL_SERVER_ERROR ||
        error.response?.status === HttpStatus.TOO_MANY_REQUESTS)
    ) {
      setEnhanceError("Sorry! Could not enhance caption, try again later");
    }
  }, []);

  const updateEnhanceError = useCallback((message: string | null) => {
    setEnhanceError(message);
  }, []);

  const canUploadData = useMemo(() => {
    return (
      Boolean(file) && post.message !== initialPost.message && !captionError
    );
  }, [captionError, file, initialPost.message, post.message]);

  return (
    <Card sx={{ width: "500px", overflow: "auto" }} elevation={elevation ?? 0}>
      <Stack
        alignItems="center"
        justifyContent="center"
        gap={5}
        mt={2}
        mx={2}
        mb={3}
      >
        {title}
        {file && (
          <img
            src={URL.createObjectURL(file)}
            alt="preview"
            width="400px"
            height="300px"
          />
        )}

        <Stack width={"100%"} alignItems={"center"} gap={3}>
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

          <Stack width={"70%"} alignItems={"center"} gap={0.75}>
            <TextField
              value={post.message}
              sx={{ width: "100%" }}
              placeholder="What's on your mind?"
              multiline
              onChange={onCaptionChange}
              error={Boolean(captionError)}
              helperText={captionError ?? enhanceError ?? ""}
              maxRows={3}
              minRows={2}
              dir={captionDirection}
            />

            <EnhanceCaptionAction
              userID={user._id}
              originalCaption={post.message ?? ""}
              onEnhanceError={onEnhanceCaptionError}
              onEnhanceSuccess={onEnhanceCaptionSuccess}
              updateEnhanceError={updateEnhanceError}
            />
          </Stack>
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
