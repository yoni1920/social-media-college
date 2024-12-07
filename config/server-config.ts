export const serverConfig = {
  port: parseInt(process.env.SERVER_PORT ?? "3000"),
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET ?? "9+10=21",
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET ?? "9+10=21Aswell",
};
