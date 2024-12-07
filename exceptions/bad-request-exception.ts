/**
 * Class representing BadRequest http exception.
 * @extends Error
 */
export class BadRequestException extends Error {
  constructor(
    message: string,
    readonly details: string | object,
    cause?: Error["stack"]
  ) {
    super(message, { cause });

    this.name = "BadRequestException";
  }
}
