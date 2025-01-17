import { ZodEffects, ZodObject, ZodRawShape } from "zod";
import { NextFunction, Request, Response } from "express";
import { BadRequestException } from "../exceptions";

export const validateBody =
  <T extends ZodRawShape>(schema: ZodObject<T> | ZodEffects<ZodObject<T>>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const validationResult = schema.safeParse(req.body);

    if (!validationResult.success) {
      const exception = new BadRequestException("Body not valid", {
        violations: validationResult.error,
      });

      console.log(validationResult.error.errors);

      next(exception);
    } else {
      next();
    }
  };
