import { ZodObject } from "zod";
import express from "express";
import { BadRequestException } from "../exceptions/bad-request-exception.js";

/**
 * @param {ZodObject} schema
 * @returns {(req: express.Request, res: express.Response, next: express.NextFunction) => void} validate middleware
 */
export const validateBody = (schema) => (req, _res, next) => {
  const validationResult = schema.safeParse(req.body);

  if (!validationResult.success) {
    const exception = new BadRequestException("Body not valid", {
      violations: validationResult.error,
    });

    next(exception);
  } else {
    next();
  }
};
