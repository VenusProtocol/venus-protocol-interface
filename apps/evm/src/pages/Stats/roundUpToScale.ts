export const roundUpToScale = (value: number) => {
  if (value <= 0) {
    return 0;
  }
  const padded = value * 1.05;
  const scale = 10 ** Math.floor(Math.log10(padded));
  return Math.ceil(padded / scale) * scale;
};
