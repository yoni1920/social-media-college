import { Router, Request, Response } from "express";
import { validateBody } from "../middleware/body-validator";
import authService from "./auth.service";
import { REFRESH_TOKEN_COOKIE_KEY } from "./constants";
import { loginSchema } from "./dto-schema";
import { validateAccessToken } from "./middleware";
import { createUserSchema } from "../users/dto-schema";
import usersService from "../users/users.service";

const router = Router();

router.post(
  "/registration",
  validateBody(createUserSchema),
  async (req, res) => {
    const { _id: userID, createdAt } = await usersService.createUser(req.body);

    const { accessToken, refreshToken } = authService.buildLoginTokens(userID);

    res.cookie(REFRESH_TOKEN_COOKIE_KEY, refreshToken.token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: refreshToken.cookieExpiry * 1_000,
    });

    res.send({
      message: "successfully registered!",
      userID,
      createdAt,
      accessToken,
    });
  }
);

router.post("/login", validateBody(loginSchema), async (req, res) => {
  const { accessToken, refreshToken } = await authService.loginUser(req.body);

  res
    .cookie(REFRESH_TOKEN_COOKIE_KEY, refreshToken.token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: refreshToken.cookieExpiry * 1_000,
    })
    .send({ accessToken });
});

router.post(
  "/logout",
  validateAccessToken,
  async (req: Request, res: Response) => {
    res.clearCookie(REFRESH_TOKEN_COOKIE_KEY).send({
      message: "User logged off",
      userID: req.userID,
    });
  }
);

router.post("/refresh", async (req, res) => {
  const refreshToken: string | undefined =
    req.cookies?.[REFRESH_TOKEN_COOKIE_KEY];

  const accessToken = await authService.refreshAccessToken(refreshToken);

  res.send({ accessToken });
});

export default router;
