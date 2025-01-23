/**
 * Class representing http exception.
 * @extends Error
 */
export class HttpException extends Error {
  constructor(
    message: string,
    readonly details: string | object,
    readonly status: number,
    readonly name: string,
    cause?: Error["stack"]
  ) {
    super(message, { cause });
  }
}
