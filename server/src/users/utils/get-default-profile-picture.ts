import { serverConfig } from "../../config";

export const getDefaultProfilePicture = () =>
  `${serverConfig.serverUrl}/images/default.webp`;
