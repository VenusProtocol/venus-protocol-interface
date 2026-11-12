import { useTheme } from 'hooks/useTheme';
import { useEffect, useRef } from 'react';
import { ASCII_PLANET_SIZE, drawAsciiPlanet } from '../drawAsciiPlanet';
import { mixHexColors } from '../mixHexColors';
import { PLANET_PALETTES } from '../palettes';

const GLYPH_SCALE = 1.1;
const FRAME_INTERVAL_MS = 50;
const PHASE_STEP = 0.008;
const MAX_PIXEL_RATIO = 2;

export interface AsciiPlanetProps {
  symbol: string;
  isOpen: boolean;
  replayToken: number;
}

export const AsciiPlanet: React.FC<AsciiPlanetProps> = ({ symbol, isOpen, replayToken }) => {
  const { isLight } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrambleRef = useRef({ isOpen: false, startedAtMs: Number.NEGATIVE_INFINITY });

  // biome-ignore lint/correctness/useExhaustiveDependencies: a replay restarts the scramble
  useEffect(() => {
    scrambleRef.current = {
      isOpen,
      startedAtMs: isOpen ? performance.now() : Number.NEGATIVE_INFINITY,
    };
  }, [isOpen, replayToken]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!canvas || !ctx) {
      return;
    }

    const [highlight, color, shadow] = PLANET_PALETTES[symbol] ?? PLANET_PALETTES.USDC;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);

    canvas.width = ASCII_PLANET_SIZE * pixelRatio;
    canvas.height = ASCII_PLANET_SIZE * pixelRatio;
    ctx.scale(pixelRatio, pixelRatio);

    const glyphColor = isLight ? color : mixHexColors({ from: color, to: highlight, ratio: 0.3 });

    const getSurfaceGradient = () => {
      if (isLight) {
        const gradient = ctx.createRadialGradient(142, 128, 12, 188, 182, 164);
        gradient.addColorStop(0, highlight);
        gradient.addColorStop(0.32, color);
        gradient.addColorStop(0.72, mixHexColors({ from: shadow, to: color, ratio: 0.4 }));
        gradient.addColorStop(1, shadow);
        return gradient;
      }

      const rimAmbient = mixHexColors({ from: shadow, to: color, ratio: 0.3 });
      const gradient = ctx.createLinearGradient(60, 220, 290, 110);
      gradient.addColorStop(0, rimAmbient);
      gradient.addColorStop(0.3, rimAmbient);
      gradient.addColorStop(0.76, color);
      gradient.addColorStop(1, highlight);
      return gradient;
    };

    const surfaceGradient = getSurfaceGradient();

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    let frame = 0;
    let lastTimeMs = 0;
    let phase = 0;
    let isVisible = false;

    const draw = () => {
      const { isOpen: isEngaged, startedAtMs } = scrambleRef.current;
      const isScrambling = isEngaged && !motionQuery.matches;

      drawAsciiPlanet({
        ctx,
        surfaceGradient,
        glyphColor,
        glyphScale: GLYPH_SCALE,
        isLight,
        phase,
        interaction: isEngaged ? 1 : 0,
        scrambleElapsedMs: isScrambling
          ? performance.now() - startedAtMs
          : Number.POSITIVE_INFINITY,
      });
    };

    const tick = (timeMs: number) => {
      frame = window.requestAnimationFrame(tick);

      if (timeMs - lastTimeMs < FRAME_INTERVAL_MS) {
        return;
      }

      lastTimeMs = timeMs;
      phase += PHASE_STEP;
      draw();
    };

    const syncLoop = () => {
      const shouldAnimate =
        isVisible && !document.hidden && document.hasFocus() && !motionQuery.matches;

      if (shouldAnimate && !frame) {
        frame = window.requestAnimationFrame(tick);
        return;
      }

      if (!shouldAnimate && frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    const intersectionObserver = new IntersectionObserver(entries => {
      isVisible = entries[0]?.isIntersecting ?? false;
      syncLoop();
    });
    intersectionObserver.observe(canvas);

    document.addEventListener('visibilitychange', syncLoop);
    window.addEventListener('focus', syncLoop);
    window.addEventListener('blur', syncLoop);
    const syncMotion = () => {
      syncLoop();
      draw();
    };

    motionQuery.addEventListener('change', syncMotion);

    draw();

    return () => {
      window.cancelAnimationFrame(frame);
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', syncLoop);
      window.removeEventListener('focus', syncLoop);
      window.removeEventListener('blur', syncLoop);
      motionQuery.removeEventListener('change', syncMotion);
    };
  }, [symbol, isLight]);

  return <canvas ref={canvasRef} className="lite-planet__ascii" />;
};
