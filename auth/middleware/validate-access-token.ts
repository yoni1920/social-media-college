import { NextFunction, Request, Response } from "express";
import { serverConfig } from "../../config";
import { UnauthorizedException } from "../../exceptions";
import jwt, { JwtPayload } from "jsonwebtoken";

const authorizationPrefix = "Bearer";

declare module "express" {
  interface Request {
    userID?: string;
  }
}

export const validateAccessToken = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const rawAccessToken = req.headers[serverConfig.authorizationHeader] as
    | string
    | undefined;

  if (!rawAccessToken) {
    throw new UnauthorizedException("Missing authorization header");
  }

  const [prefix, accessToken] = rawAccessToken.split(" ");

  if (prefix !== authorizationPrefix) {
    throw new UnauthorizedException(
      "Invalid authorization bearer header format"
    );
  }

  try {
    const { userID } = jwt.verify(
      accessToken,
      serverConfig.accessTokenSecret
    ) as JwtPayload;

    req.userID = userID;

    next();
  } catch (error) {
    throw new UnauthorizedException(
      "Invalid access token",
      (error as Error).stack
    );
  }
};
