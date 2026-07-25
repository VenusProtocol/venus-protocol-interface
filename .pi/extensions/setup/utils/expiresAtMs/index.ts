export const expiresAtMs = (expiresInSeconds: number | undefined) => {
  if (!expiresInSeconds) {
    return undefined;
  }

  return Date.now() + expiresInSeconds * 1000;
};
