import { ASCII_PLANET_SIZE, drawAsciiSphere } from '../../drawAsciiPlanet';
import { SCRAMBLE_STEP_MS } from '../../getScrambledGlyph';
import { isGradientTextSlow } from '../../isGradientTextSlow';
import { getSurfaceGradient } from '../getSurfaceGradient';

const CENTER = ASCII_PLANET_SIZE / 2;

export interface CreateSphereRendererInput {
  ctx: CanvasRenderingContext2D;
  pixelRatio: number;
  glyphScale: number;
  isLight: boolean;
  highlight: string;
  color: string;
  shadow: string;
}

export const createSphereRenderer = ({
  ctx,
  pixelRatio,
  glyphScale,
  isLight,
  highlight,
  color,
  shadow,
}: CreateSphereRendererInput) => {
  const cache = isGradientTextSlow() ? document.createElement('canvas') : undefined;
  const cacheCtx = cache?.getContext('2d');

  if (!cache || !cacheCtx) {
    const surfaceGradient = getSurfaceGradient({ ctx, isLight, highlight, color, shadow });

    return {
      drawSphere: (scrambleElapsedMs: number) => {
        ctx.fillStyle = surfaceGradient;
        drawAsciiSphere({ ctx, center: CENTER, glyphScale, scrambleElapsedMs, isLight });
      },
      dispose: () => {},
    };
  }

  cache.style.display = 'none';
  document.body.append(cache);
  cache.width = ASCII_PLANET_SIZE * pixelRatio;
  cache.height = ASCII_PLANET_SIZE * pixelRatio;
  cacheCtx.scale(pixelRatio, pixelRatio);
  cacheCtx.font = `${9 * glyphScale}px monospace`;
  cacheCtx.textAlign = 'center';
  cacheCtx.textBaseline = 'middle';

  const surfaceGradient = getSurfaceGradient({ ctx: cacheCtx, isLight, highlight, color, shadow });
  let cachedScrambleStep: number | undefined;

  const renderCache = (scrambleElapsedMs: number) => {
    const scrambleStep = Number.isFinite(scrambleElapsedMs)
      ? Math.floor(scrambleElapsedMs / SCRAMBLE_STEP_MS)
      : Number.POSITIVE_INFINITY;

    if (scrambleStep === cachedScrambleStep) {
      return;
    }

    cachedScrambleStep = scrambleStep;
    cacheCtx.clearRect(0, 0, ASCII_PLANET_SIZE, ASCII_PLANET_SIZE);
    cacheCtx.globalCompositeOperation = 'source-over';
    cacheCtx.fillStyle = '#ffffff';
    drawAsciiSphere({ ctx: cacheCtx, center: CENTER, glyphScale, scrambleElapsedMs, isLight });
    cacheCtx.globalCompositeOperation = 'source-in';
    cacheCtx.globalAlpha = 1;
    cacheCtx.fillStyle = surfaceGradient;
    cacheCtx.fillRect(0, 0, ASCII_PLANET_SIZE, ASCII_PLANET_SIZE);
    cacheCtx.globalCompositeOperation = 'source-over';
  };

  return {
    drawSphere: (scrambleElapsedMs: number) => {
      renderCache(scrambleElapsedMs);
      ctx.globalAlpha = 1;
      ctx.drawImage(cache, 0, 0, ASCII_PLANET_SIZE, ASCII_PLANET_SIZE);
    },
    dispose: () => cache.remove(),
  };
};
