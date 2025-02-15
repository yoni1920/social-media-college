import { postsApi } from "../../api/posts-api";
import { EnhanceCaptionResponse } from "../types";
import { EnhanceCaptionRequest } from "../types/enhance-caption-request";

export const handleEnhanceCaption = async (
  enhanceCaptionRequest: EnhanceCaptionRequest,
  onSuccess: (enhanceResponse?: EnhanceCaptionResponse) => void,
  onError: (error: Error) => void
) => {
  try {
    const { data: enhanceResponse } = await postsApi.post(
      "/caption",
      enhanceCaptionRequest
    );

    onSuccess(enhanceResponse);
  } catch (error) {
    onError(error as Error);
  }
};
