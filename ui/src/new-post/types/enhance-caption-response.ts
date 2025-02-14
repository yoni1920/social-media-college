type EnhanceSuccess = {
  status: "SUCCESS";
  caption: string;
};

type EnhanceFailure = {
  status: "FAILURE";
  reason: string;
};

export type EnhanceCaptionResponse = EnhanceSuccess | EnhanceFailure;
