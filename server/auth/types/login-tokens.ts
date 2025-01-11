import { ExpirySecs } from "../enums";

export type LoginTokens = {
  accessToken: string;
  refreshToken: {
    token: string;
    cookieExpiry: ExpirySecs;
  };
};
