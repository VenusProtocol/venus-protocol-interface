export const safeJsonParse = (value: string | number | boolean) => {
  try {
    return JSON.parse(value.toString());
  } catch {
    return value;
  }
};
