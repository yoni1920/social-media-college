import { NextFunction, Request, Response } from "express";
import { BadRequestException, HttpException } from "../exceptions";

export const handleGeneralError = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error({
    message: error.message,
    stack: error.stack,
  });

  if (error instanceof HttpException) {
    const { message, details } = error;

    res.status(error.status).send({
      message,
      details,
    });
  } else {
    res.status(500).send({
      message: "Something went wrong",
    });
  }
};
