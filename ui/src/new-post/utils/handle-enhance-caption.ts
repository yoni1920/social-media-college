import { postsApi } from "../../api/posts-api";
import { TextDirection } from "../../types";
import { EnhanceCaptionResponse } from "../types";
import { EnhanceCaptionRequest } from "../types/enhance-caption-request";

export const handleEnhanceCaption = async (
  enhanceCaptionRequest: EnhanceCaptionRequest & {
    languageDirection?: TextDirection;
  },
  onSuccess: (
    enhanceResponse: EnhanceCaptionResponse,
    captionDirection?: TextDirection
  ) => void,
  onError: (error: Error) => void
) => {
  try {
    const { languageDirection, ...enhanceRequestData } = enhanceCaptionRequest;

    const { data: enhanceResponse } = await postsApi.post(
      "/caption",
      enhanceRequestData
    );

    onSuccess(enhanceResponse, languageDirection);
  } catch (error) {
    onError(error as Error);
  }
};
