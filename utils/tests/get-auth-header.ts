import { LoginTokens } from "../../auth/types";
import { serverConfig } from "../../config";

export const getAuthHeader = (accessToken: LoginTokens["accessToken"]) => ({
  [serverConfig.authorizationHeader]: `Bearer ${accessToken}`,
});
