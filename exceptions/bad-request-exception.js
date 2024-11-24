/**
 * Class representing BadRequest http exception.
 * @extends Error
 */
export class BadRequestException extends Error {
  /**
   * Throws bad request exception
   * @param {string} message
   * @param {string | object} details
   * @param {Error['stack']} cause
   */
  constructor(message, details, cause) {
    super(message, { cause });

    this.name = "BadRequestException";
    this.details = details;
  }
}
