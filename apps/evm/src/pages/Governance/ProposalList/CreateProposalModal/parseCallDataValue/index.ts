import { safeJsonParse } from '../safeJsonParse';
import { quoteUnsafeIntegers } from './quoteUnsafeIntegers';

export const parseCallDataValue = (value: string) => {
  const parsedValue = safeJsonParse(quoteUnsafeIntegers(value));

  // Large integers lose precision when parsed, so keep strings
  return typeof parsedValue === 'number' ? value : parsedValue;
};
