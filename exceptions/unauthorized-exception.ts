import { HttpException } from "./http-exception";

/**
 * Class representing Unauthorized http exception.
 * @extends Error
 */
export class UnauthorizedException extends HttpException {
  constructor(readonly details: string | object) {
    super("User is unauthorized", details, 401, "UnauthorizedException");
  }
}
