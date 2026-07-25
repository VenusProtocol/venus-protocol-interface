export const limit = (value: number | undefined) => {
  if (!value || value < 1) {
    return 10;
  }

  return Math.min(Math.floor(value), 20);
};
