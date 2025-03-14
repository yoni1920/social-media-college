import { Router, Request, Response } from "express";
import { validateBody } from "../middleware/body-validator";
import authService from "./auth.service";
import { ACCESS_TOKEN_COOKIE_KEY, REFRESH_TOKEN_COOKIE_KEY } from "./constants";
import { loginSchema } from "./dto-schema";
import { validateAccessToken } from "./middleware";
import { createUserSchema } from "../users/dto-schema";
import usersService from "../users/users.service";
import passport from "passport";
import { serverConfig } from "../config";
import { UserReturnDTO } from "../users/dto-schema/user-return-dto";

const router = Router();

/**
 * @openapi
 * /auth/registration/:
 *   post:
 *     description: Register user
 *     requestBody:
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - username
 *              - password
 *              - email
 *              - bio
 *            properties:
 *              username:
 *                type: string
 *                required: true
 *                example: idoavni
 *              password:
 *                type: string
 *                required: true
 *                example: weakpassword
 *              email:
 *                type: string
 *                required: true
 *                example: 4o5e6@example.com
 *              bio:
 *                type: string
 *                required: false
 *                example: Lorem ipsum dolor sit amet consectetur adipiscing elit
 *     responses:
 *       200:
 *         description: Returns created user id, creation date, access token, and refresh token cookie
 *       400:
 *         description: Bad request
 */
router.post(
  "/registration",
  validateBody(createUserSchema),
  async (req, res) => {
    const user = await usersService.createUser(req.body);

    const { accessToken, refreshToken } = authService.buildLoginTokens(
      user._id
    );

    res.cookie(REFRESH_TOKEN_COOKIE_KEY, refreshToken.token, {
      httpOnly: true,
      maxAge: refreshToken.cookieExpiry * 1_000,
    });

    res.cookie(ACCESS_TOKEN_COOKIE_KEY, accessToken.token, {
      sameSite: "lax",
      httpOnly: true,
      maxAge: accessToken.cookieExpiry * 1_000,
    });

    res.send({ user });
  }
);

/**
 * @openapi
 * /auth/login/:
 *   post:
 *     description: Login user
 *     requestBody:
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - password
 *            properties:
 *              username:
 *                type: string
 *                required: false
 *                example: idoavni
 *              password:
 *                type: string
 *                required: true
 *                example: weakpassword
 *              email:
 *                type: string
 *                required: false
 *                example: 4o5e6@example.com
 *     responses:
 *       200:
 *         description: Returns access token, and refresh token cookie
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized user
 */
router.post("/login", validateBody(loginSchema), async (req, res) => {
  const {
    user,
    tokens: { accessToken, refreshToken },
  } = await authService.loginUser(req.body);

  res.cookie(REFRESH_TOKEN_COOKIE_KEY, refreshToken.token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: refreshToken.cookieExpiry * 1_000,
  });

  res.cookie(ACCESS_TOKEN_COOKIE_KEY, accessToken.token, {
    sameSite: "lax",
    httpOnly: true,
    maxAge: accessToken.cookieExpiry * 1_000,
  });

  res.send({ user });
});

/**
 * @openapi
 * /auth/logout/:
 *   post:
 *     description: Logout user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: clears refresh token cookie
 *       401:
 *         description: Unauthorized user
 */
router.post("/logout", async (req: Request, res: Response) => {
  res
    .clearCookie(REFRESH_TOKEN_COOKIE_KEY)
    .clearCookie(ACCESS_TOKEN_COOKIE_KEY)
    .send({
      message: "User logged off",
    });
});

/**
 * @openapi
 * /auth/refresh/:
 *   post:
 *     description: Refresh user access token
 *     responses:
 *       200:
 *         description: returns new user access token
 *       401:
 *         description: Unauthorized user
 */
router.post("/refresh", async (req, res) => {
  const refreshToken: string | undefined =
    req.cookies?.[REFRESH_TOKEN_COOKIE_KEY];

  const { accessToken, refreshToken: newRefreshToken } =
    await authService.refreshAccessToken(refreshToken);

  res.cookie(REFRESH_TOKEN_COOKIE_KEY, newRefreshToken.token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: newRefreshToken.cookieExpiry * 1_000,
  });

  res
    .cookie(ACCESS_TOKEN_COOKIE_KEY, accessToken.token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: accessToken.cookieExpiry * 1_000,
    })
    .send({ message: "refreshed" });
});

router.post("/me", validateAccessToken, async (req: Request, res: Response) => {
  const user = req.authUser;

  res.json({ user });
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${serverConfig.clientUrl}`,
    session: false,
  }),
  (req, res) => {
    const authUser = req.user as UserReturnDTO;
    const { accessToken, refreshToken } = authService.buildLoginTokens(
      authUser._id
    );

    res.cookie(REFRESH_TOKEN_COOKIE_KEY, refreshToken.token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: refreshToken.cookieExpiry * 1_000,
    });

    res.cookie(ACCESS_TOKEN_COOKIE_KEY, accessToken.token, {
      sameSite: "lax",
      httpOnly: true,
      maxAge: accessToken.cookieExpiry * 1_000,
    });

    res.redirect(serverConfig.clientUrl);
  }
);

export default router;
