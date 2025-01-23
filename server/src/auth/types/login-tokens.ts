import { ExpirySecs } from "../enums";

export type LoginTokens = {
  accessToken: {
    token: string;
    cookieExpiry: ExpirySecs;
  };
  refreshToken: {
    token: string;
    cookieExpiry: ExpirySecs;
  };
};
