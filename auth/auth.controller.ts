import express, { Response } from "express";
import { validateBody } from "../middleware/body-validator";
import { loginSchema } from "./dto-schema/login.dto";
import authService from "./auth.service";
import { REFRESH_TOKEN_COOKIE_KEY } from "./constants";

const router = express.Router();

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

// TODO: login

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

// TODO: logoff

export default router;
