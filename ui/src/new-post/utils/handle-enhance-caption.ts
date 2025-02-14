import { EnhanceCaptionResponse } from "../types";
import { EnhanceCaptionRequest } from "../types/enhance-caption-request";

export const handleEnhanceCaption = async (
  enhanceCaptionRequest: EnhanceCaptionRequest,
  onSuccess: (enhanceResponse?: EnhanceCaptionResponse) => void,
  onError: (error: Error) => void
) => {
  try {
    // TODO: delete
    await new Promise((r) => setTimeout(r, 5_000));

    const response = await enhanceTempAPI({
      // caption: "New Caption, blah blah blah",
      failReason: "The caption is too concise for enhancement",
    });

    onSuccess(response);
  } catch (error) {
    onError(error as Error);
  }
};

const enhanceTempAPI = async (options: {
  failReason?: string;
  caption?: string;
}): Promise<EnhanceCaptionResponse> => {
  return new Promise<EnhanceCaptionResponse>((resolve) => {
    if (options.failReason) {
      resolve({ status: "FAILURE", reason: options.failReason });
    } else {
      resolve({ status: "SUCCESS", caption: options.caption ?? "" });
    }
  });
};
