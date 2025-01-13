import { LoginTokens } from "../../auth/types";
import { serverConfig } from "../../config";

export const getAuthHeader = (
  accessToken: LoginTokens["accessToken"]["token"]
) => ({
  [serverConfig.authorizationHeader]: `Bearer ${accessToken}`,
});
