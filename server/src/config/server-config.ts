export const serverConfig = {
  port: parseInt(process.env.SERVER_PORT ?? "4000"),
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET ?? "9+10=21",
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET ?? "9+10=21Aswell",
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:5173",
  environment: process.env.NODE_ENV ?? "dev",
  serverUrl: process.env.SERVER_URL ?? "http://localhost:4000",
  env: process.env.NODE_ENV ?? "dev",
};
