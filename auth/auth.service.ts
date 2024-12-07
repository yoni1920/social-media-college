import { UnauthorizedException } from "../exceptions";
import { User } from "../users/user.model";
import usersService from "../users/users.service";
import { LoginDTO } from "./dto-schema";
import { compare } from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { LoginTokens } from "./types";
import { ExpirySecs } from "./enums";
import { serverConfig } from "../config";
import { delay } from "../utils/delay";
import { INVALID_LOGIN_DELAY_MS } from "./constants";

const invalidCredentialsError = new UnauthorizedException(
  "User credentials do not match"
);

const loginUser = async (userCredentials: LoginDTO): Promise<LoginTokens> => {
  const user = await getUserByCredentials(userCredentials);

  if (!user) {
    await delay(INVALID_LOGIN_DELAY_MS);

    throw invalidCredentialsError;
  }

  const { password: hashedPassword, ...otherUserData } = user;

  const isPasswordValid = await compare(
    userCredentials.password,
    hashedPassword
  );

  if (!isPasswordValid) {
    await delay(INVALID_LOGIN_DELAY_MS);

    throw invalidCredentialsError;
  }

  return buildLoginTokens({ ...otherUserData });
};

const refreshAccessToken = async (
  refreshToken: string | undefined
): Promise<string> => {
  if (!refreshToken) {
    throw new UnauthorizedException("Missing refresh token");
  }

  try {
    const { userID } = jwt.verify(
      refreshToken,
      serverConfig.refreshTokenSecret
    ) as JwtPayload;

    const user = await usersService.getUserByID(userID);

    const accessToken = jwt.sign(user, serverConfig.accessTokenSecret, {
      expiresIn: ExpirySecs.TEN_MINUTES,
    });

    return accessToken;
  } catch (error) {
    throw new UnauthorizedException(
      "Invalid refresh token",
      (error as Error).stack
    );
  }
};

const getUserByCredentials = async ({
  username,
  email,
}: LoginDTO): Promise<User | undefined> => {
  return username
    ? await usersService.getUserByUsername(username)
    : await usersService.getUserByEmail(email as string);
};

const buildLoginTokens = (user: Omit<User, "password">): LoginTokens => {
  const accessToken = jwt.sign(user, serverConfig.accessTokenSecret, {
    expiresIn: ExpirySecs.TEN_MINUTES,
  });

  const refreshToken = jwt.sign(
    { userID: user._id },
    serverConfig.refreshTokenSecret,
    {
      expiresIn: ExpirySecs.ONE_DAY,
    }
  );

  return {
    accessToken,
    refreshToken: {
      token: refreshToken,
      cookieExpiry: ExpirySecs.ONE_DAY,
    },
  };
};

export default {
  loginUser,
  refreshAccessToken,
};
