import { NextFunction, Request, Response } from "express";

export const noRouteFoundHandler = (
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  res.status(404).send({ message: "Sorry can't find that!" });
};
