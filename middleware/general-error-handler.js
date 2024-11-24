import { BadRequestException } from "../exceptions/bad-request-exception.js";

export const handleGeneralError = (error, _req, res, _next) => {
  console.error({
    message: error.message,
    stack: error.stack,
  });

  if (error instanceof BadRequestException) {
    const { message, details } = error;

    res.status(400).send({
      message,
      ...details,
    });
  } else {
    res.status(500).send({
      message: "Something went wrong",
    });
  }
};
