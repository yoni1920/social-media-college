export const serverConfig = {
  port: parseInt(process.env.SERVER_PORT ?? "8000"),
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET ?? "9+10=21",
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET ?? "9+10=21Aswell",
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:8000",
  environment: process.env.NODE_ENV ?? "dev",
  serverUrl: process.env.SERVER_URL ?? "http://localhost:8000",
};
