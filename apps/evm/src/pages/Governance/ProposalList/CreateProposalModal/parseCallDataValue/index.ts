import { safeJsonParse } from '../safeJsonParse';

export const parseCallDataValue = (value: string) => {
  const parsedValue = safeJsonParse(value);

  // Large integers lose precision when parsed, so keep strings
  return typeof parsedValue === 'number' ? value : parsedValue;
};
