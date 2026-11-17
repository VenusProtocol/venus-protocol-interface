import { getScrambledGlyph } from '../getScrambledGlyph';
import { drawAsciiRing } from './drawAsciiRing';

export { drawAsciiSphere } from './drawAsciiSphere';

export const ASCII_PLANET_SIZE = 360;

const CENTER = ASCII_PLANET_SIZE / 2;
const RING_RADIUS_X = 170;
const RING_RADIUS_Y = 43;
const RING_TILT_COS = 0.94;
const RING_TILT_SIN = 0.34;
const PARTICLE_COUNT = 3;
const PARTICLE_TAIL_LENGTH = 4;

export interface DrawAsciiPlanetInput {
  ctx: CanvasRenderingContext2D;
  drawSphere: () => void;
  glyphColor: string;
  glyphScale: number;
  phase: number;
  interaction: number;
  scrambleElapsedMs: number;
  isLight: boolean;
}

export const drawAsciiPlanet = ({
  ctx,
  drawSphere,
  glyphColor,
  glyphScale,
  phase,
  interaction,
  scrambleElapsedMs,
  isLight,
}: DrawAsciiPlanetInput) => {
  ctx.clearRect(0, 0, ASCII_PLANET_SIZE, ASCII_PLANET_SIZE);
  ctx.font = `${9 * glyphScale}px monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillStyle = glyphColor;
  drawAsciiRing({
    ctx,
    center: CENTER,
    phase,
    interaction,
    scrambleElapsedMs,
    isFront: false,
    isLight,
  });

  drawSphere();

  ctx.fillStyle = glyphColor;
  drawAsciiRing({
    ctx,
    center: CENTER,
    phase,
    interaction,
    scrambleElapsedMs,
    isFront: true,
    isLight,
  });

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
        getScrambledGlyph({
          glyph: tail === 0 ? '+' : '.',
          index: star * PARTICLE_TAIL_LENGTH + tail + 3000,
          elapsedMs: scrambleElapsedMs,
        }),
        CENTER + x * RING_TILT_COS + y * RING_TILT_SIN,
        CENTER - x * RING_TILT_SIN + y * RING_TILT_COS,
      );
    }
  }

  ctx.globalAlpha = 1;
};
