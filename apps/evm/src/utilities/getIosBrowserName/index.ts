export const getIosBrowserName = (userAgent: string) => {
  if (/CriOS\//.test(userAgent)) {
    return 'Chrome';
  }

  if (/FxiOS\//.test(userAgent)) {
    return 'Firefox';
  }

  if (/EdgiOS\//.test(userAgent)) {
    return 'Edge';
  }

  if (/Version\/[\d.]+.*Safari\//.test(userAgent)) {
    return 'Safari';
  }

  return 'In-app browser';
};
