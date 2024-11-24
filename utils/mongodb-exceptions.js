import { BadRequestException } from "../exceptions/bad-request-exception.js";

const MONGODB_DUPLICATE_KEY_ERROR = "E11000";

/**
 *
 * @param {Error} error
 * @returns {boolean} if error message is MongoDB duplicate key
 */
const isErrorDuplicateKey = ({ message }) => {
  return message.includes(MONGODB_DUPLICATE_KEY_ERROR);
};

/**
 * Returns the duplicate key field
 * @param {string} errorMessage
 * @returns {{ field: string, value: string }} duplicate key field
 */
const extractDuplicateKey = (errorMessage) => {
  const fieldStart = errorMessage.indexOf("{") + 1;

  const [field, value] = errorMessage
    .slice(fieldStart, -1)
    .trim()
    .replaceAll(`"`, "")
    .split(": ");

  return {
    field,
    value,
  };
};

/**
 * Handles MongoDB duplicate key exceptions
 * @param {Error} error
 */
export const handleDuplicateKeyException = (error) => {
  if (isErrorDuplicateKey(error)) {
    const { field, value } = extractDuplicateKey(error.message);

    throw new BadRequestException(`${field} already exists`, {
      value,
    });
  }

  throw error;
};
