import { getScrambledGlyph } from '../../getScrambledGlyph';

const SPHERE_RADIUS = 120;
const GRID_LIMIT = 119;
const GLYPH_RAMP = '.:+*oO#@';

export interface DrawAsciiSphereInput {
  ctx: CanvasRenderingContext2D;
  center: number;
  glyphScale: number;
  scrambleElapsedMs: number;
  isLight: boolean;
}

export const drawAsciiSphere = ({
  ctx,
  center,
  glyphScale,
  scrambleElapsedMs,
  isLight,
}: DrawAsciiSphereInput) => {
  const stepX = 6 * glyphScale;
  const stepY = 7 * glyphScale;
  let glyphIndex = 0;

  for (let y = -Math.floor(GRID_LIMIT / stepY) * stepY; y <= GRID_LIMIT; y += stepY) {
    for (let x = -Math.floor(GRID_LIMIT / stepX) * stepX; x <= GRID_LIMIT; x += stepX) {
      const nx = x / SPHERE_RADIUS;
      const ny = y / SPHERE_RADIUS;
      const squaredRadius = nx * nx + ny * ny;

      if (squaredRadius > 1) {
        continue;
      }

      const z = Math.sqrt(1 - squaredRadius);
      const edge = (1 - z) ** 1.4;
      const facing = Math.max(0, nx * 0.8 - ny * 0.5);
      const shade = Math.max(0, -0.45 * nx - 0.4 * ny + 0.75 * z);
      const density = isLight
        ? Math.min(1, 0.3 + shade * 0.45 + edge * 0.12)
        : Math.min(1, 0.22 + z * 0.15 + edge * 0.24 + facing * 0.65);

      ctx.globalAlpha = 0.18 + density * 0.82;
      ctx.fillText(
        getScrambledGlyph({
          glyph: GLYPH_RAMP[Math.min(7, Math.floor(density * 8))],
          index: glyphIndex,
          elapsedMs: scrambleElapsedMs,
        }),
        center + x,
        center + y,
      );
      glyphIndex++;
    }
  }
};
