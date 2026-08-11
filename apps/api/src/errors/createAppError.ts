import { AppError } from "./AppError.js";
import { ERROR_CODES } from "./errorCodes.js";

export function createAppError(code: keyof typeof ERROR_CODES) {
  const error = ERROR_CODES[code];

  return new AppError(code, error.message, error.statusCode);
}
