import { HttpException } from "./http-exception";

/**
 * Class representing BadRequest http exception.
 * @extends Error
 */
export class BadRequestException extends HttpException {
  constructor(
    message: string,
    details: string | object,
    cause?: Error["stack"]
  ) {
    super(message, details, 400, "BadRequestException", cause);
  }
}
