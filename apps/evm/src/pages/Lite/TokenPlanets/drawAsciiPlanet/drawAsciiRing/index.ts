import { getScrambledGlyph } from '../../getScrambledGlyph';

const RING_GLYPH_COUNT = 150;
const RING_RADIUS_X = 170;
const RING_RADIUS_Y = 43;
const RING_TILT_COS = 0.94;
const RING_TILT_SIN = 0.34;

export interface DrawAsciiRingInput {
  ctx: CanvasRenderingContext2D;
  center: number;
  phase: number;
  interaction: number;
  scrambleElapsedMs: number;
  isFront: boolean;
}

export const drawAsciiRing = ({
  ctx,
  center,
  phase,
  interaction,
  scrambleElapsedMs,
  isFront,
}: DrawAsciiRingInput) => {
  for (let index = 0; index < RING_GLYPH_COUNT; index++) {
    const angle = (index / RING_GLYPH_COUNT) * Math.PI * 2 + phase * 0.35;
    const x = Math.cos(angle) * RING_RADIUS_X;
    const y = Math.sin(angle) * RING_RADIUS_Y;

    if (Math.sin(angle) > 0 !== isFront) {
      continue;
    }

    ctx.globalAlpha = 0.7 + interaction * 0.15;
    ctx.fillText(
      getScrambledGlyph({
        glyph: index % 5 === 0 ? '+' : '.',
        index: index + 2000,
        elapsedMs: scrambleElapsedMs,
      }),
      center + x * RING_TILT_COS + y * RING_TILT_SIN,
      center - x * RING_TILT_SIN + y * RING_TILT_COS,
    );
  }
};
