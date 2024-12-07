import { BadRequestException } from "../exceptions";

const MONGODB_DUPLICATE_KEY_ERROR = "E11000";

const isErrorDuplicateKey = ({ message }: Error): boolean => {
  return message.includes(MONGODB_DUPLICATE_KEY_ERROR);
};

const extractDuplicateKey = (
  errorMessage: string
): { field: string; value: string } => {
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

export const handleDuplicateKeyException = (error: Error) => {
  if (isErrorDuplicateKey(error)) {
    const { field, value } = extractDuplicateKey(error.message);

    throw new BadRequestException(`${field} already exists`, {
      value,
    });
  }

  throw error;
};
