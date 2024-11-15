import { ZodObject } from "zod";
import express from "express";

/**
 * @param {ZodObject} schema
 * @returns {(req: express.Request, res: express.Response, next: express.NextFunction) => void} validate middleware
 */
export const validateBody = (schema) => (req, res, next) => {
  const validationResult = schema.safeParse(req.body);

  if (!validationResult.success) {
    res.status(400).send({
      message: "Body not valid",
      violations: validationResult.error,
    });
  } else {
    next();
  }
};
