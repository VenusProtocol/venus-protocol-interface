// Keeps the sky quieter behind the page's reading areas.
export const isBehindContent = ({ x, y }: { x: number; y: number }) =>
  (x > 0.25 && x < 0.76 && y > 0.08 && y < 0.35) ||
  (x > 0.68 && y > 0.66) ||
  (x < 0.34 && y > 0.68) ||
  (x > 0.55 && y > 0.46 && y < 0.56);
