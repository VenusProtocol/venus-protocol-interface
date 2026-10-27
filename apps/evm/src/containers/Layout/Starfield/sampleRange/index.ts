export const sampleRange = (range: readonly number[], seed: number) =>
  range[0] + (range[1] - range[0]) * seed;
