const PROBE_GLYPH_COUNT = 60;
const SLOW_PROBE_MS = 8;

let isSlow: boolean | undefined;

export const isGradientTextSlow = () => {
  if (isSlow !== undefined) {
    return isSlow;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 120;
  canvas.height = 120;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    isSlow = false;
    return isSlow;
  }

  const gradient = ctx.createLinearGradient(0, 0, 120, 120);
  gradient.addColorStop(0, '#000000');
  gradient.addColorStop(1, '#ffffff');
  ctx.font = '10px monospace';
  ctx.fillStyle = gradient;

  const startedAtMs = performance.now();

  for (let index = 0; index < PROBE_GLYPH_COUNT; index++) {
    ctx.fillText('o', (index % 10) * 12, Math.floor(index / 10) * 12 + 10);
  }

  ctx.getImageData(0, 0, 1, 1);
  isSlow = performance.now() - startedAtMs > SLOW_PROBE_MS;

  return isSlow;
};
