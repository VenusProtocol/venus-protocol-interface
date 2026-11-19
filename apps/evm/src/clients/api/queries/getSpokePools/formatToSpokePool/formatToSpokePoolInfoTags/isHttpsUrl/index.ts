export const isHttpsUrl = (url?: string | null): url is string => {
  if (!url) {
    return false;
  }

  try {
    return new URL(url).protocol === 'https:';
  } catch {
    return false;
  }
};
