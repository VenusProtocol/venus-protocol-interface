import { getScrambledGlyph } from '../getScrambledGlyph';

export const ASCII_PLANET_SIZE = 360;

const CENTER = ASCII_PLANET_SIZE / 2;
const SPHERE_RADIUS = 120;
const GRID_LIMIT = 119;
const GLYPH_RAMP = '.:+*oO#@';
const RING_GLYPH_COUNT = 150;
const RING_RADIUS_X = 170;
const RING_RADIUS_Y = 43;
const RING_TILT_COS = 0.94;
const RING_TILT_SIN = 0.34;
const PARTICLE_COUNT = 3;
const PARTICLE_TAIL_LENGTH = 4;

export interface DrawAsciiPlanetInput {
  ctx: CanvasRenderingContext2D;
  surfaceGradient: CanvasGradient;
  glyphColor: string;
  glyphScale: number;
  phase: number;
  interaction: number;
  scrambleElapsedMs: number;
}

export const drawAsciiPlanet = ({
  ctx,
  surfaceGradient,
  glyphColor,
  glyphScale,
  phase,
  interaction,
  scrambleElapsedMs,
}: DrawAsciiPlanetInput) => {
  const toGlyph = (glyph: string, index: number) =>
    getScrambledGlyph({ glyph, index, elapsedMs: scrambleElapsedMs });

  const drawRing = (isFront: boolean) => {
    for (let index = 0; index < RING_GLYPH_COUNT; index++) {
      const angle = (index / RING_GLYPH_COUNT) * Math.PI * 2 + phase * 0.35;
      const x = Math.cos(angle) * RING_RADIUS_X;
      const y = Math.sin(angle) * RING_RADIUS_Y;

      if (Math.sin(angle) > 0 !== isFront) {
        continue;
      }

      ctx.globalAlpha = 0.7 + interaction * 0.15;
      ctx.fillText(
        toGlyph(index % 5 === 0 ? '+' : '.', index + 2000),
        CENTER + x * RING_TILT_COS + y * RING_TILT_SIN,
        CENTER - x * RING_TILT_SIN + y * RING_TILT_COS,
      );
    }
  };

  ctx.clearRect(0, 0, ASCII_PLANET_SIZE, ASCII_PLANET_SIZE);
  ctx.font = `${9 * glyphScale}px monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillStyle = glyphColor;
  drawRing(false);

  ctx.fillStyle = surfaceGradient;

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
      const density = Math.min(1, 0.22 + z * 0.15 + edge * 0.24 + facing * 0.65);

      ctx.globalAlpha = 0.18 + density * 0.82;
      ctx.fillText(
        toGlyph(GLYPH_RAMP[Math.min(7, Math.floor(density * 8))], glyphIndex),
        CENTER + x,
        CENTER + y,
      );
      glyphIndex++;
    }
  }

  ctx.fillStyle = glyphColor;
  drawRing(true);

  for (let star = 0; star < PARTICLE_COUNT; star++) {
    for (let tail = 0; tail < PARTICLE_TAIL_LENGTH; tail++) {
      const angle = phase * 0.65 + (star * Math.PI * 2) / PARTICLE_COUNT - tail * 0.045;
      const x = Math.cos(angle) * RING_RADIUS_X;
      const y = Math.sin(angle) * RING_RADIUS_Y;

      if (Math.sin(angle) < 0 && Math.abs(x) < 115) {
        continue;
      }

      ctx.globalAlpha = (1 - tail / PARTICLE_TAIL_LENGTH) * (0.65 + interaction * 0.3);
      ctx.fillText(
        toGlyph(tail === 0 ? '+' : '.', star * PARTICLE_TAIL_LENGTH + tail + 3000),
        CENTER + x * RING_TILT_COS + y * RING_TILT_SIN,
        CENTER - x * RING_TILT_SIN + y * RING_TILT_COS,
      );
    }
  }

  ctx.globalAlpha = 1;
};
