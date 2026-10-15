import { safeJsonParse } from '../safeJsonParse';
import { quoteUnsafeIntegers } from './quoteUnsafeIntegers';

export const parseCallDataValue = (value: string) => {
  const parsedValue = safeJsonParse(quoteUnsafeIntegers(value));

  // Integers outside the safe range lose precision once parsed, so they are kept as strings
  return typeof parsedValue === 'number' ? value : parsedValue;
};
