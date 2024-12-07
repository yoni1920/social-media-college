import { Router, Request, Response } from "express";
import { validateBody } from "../middleware/body-validator";
import authService from "./auth.service";
import { REFRESH_TOKEN_COOKIE_KEY } from "./constants";
import { loginSchema } from "./dto-schema";
import { validateAccessToken } from "./middleware";

const router = Router();

// TODO: registration

// router.post(
//   "/registration",
//   validateBody(createUserSchema),
//   async (req, res) => {
//     const { id, createdAt } = await usersService.createUser(req.body);

//     // res.send({
//     //   message: "created new comment",
//     //   commentID: id,
//     //   date: createdAt,
//     // });
//   }
// );

router.post("/login", validateBody(loginSchema), async (req, res) => {
  const { accessToken, refreshToken } = await authService.loginUser(req.body);

  // TODO: set to secure true
  res
    .cookie(REFRESH_TOKEN_COOKIE_KEY, refreshToken.token, {
      httpOnly: true,
      sameSite: "none",
      secure: false,
      maxAge: refreshToken.cookieExpiry * 1_000,
    })
    .send({ accessToken });
});

router.post(
  "/logout",
  validateAccessToken,
  async (req: Request, res: Response) => {
    const userID = req.user?._id;

    res.clearCookie(REFRESH_TOKEN_COOKIE_KEY).send({
      message: "User logged off",
      userID,
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
