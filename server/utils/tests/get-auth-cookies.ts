import { ACCESS_TOKEN_COOKIE_KEY } from "../../auth/constants";
import { LoginTokens } from "../../auth/types";

export const getAuthCookies = (
  accessToken: LoginTokens["accessToken"]["token"]
) => [`${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`];
