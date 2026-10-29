import { useEffect, useRef, useState } from 'react';
import { SCRAMBLE_STEP_MS, getScrambledGlyph } from '../getScrambledGlyph';
import { PLANET_PALETTES } from '../palettes';
import { ASCII_MARK_SIZE, type MarkGlyph, sampleMarkGlyphs } from '../sampleMarkGlyphs';

const GLYPH_SCALE = 1.1;
const MAX_PIXEL_RATIO = 2;

export interface AsciiTokenMarkProps {
  symbol: string;
  src: string;
  isOpen: boolean;
  replayToken: number;
}

export const AsciiTokenMark: React.FC<AsciiTokenMarkProps> = ({
  symbol,
  src,
  isOpen,
  replayToken,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [glyphs, setGlyphs] = useState<MarkGlyph[]>([]);

  useEffect(() => {
    let isCancelled = false;
    const image = new Image();

    image.onload = () => {
      if (isCancelled) {
        return;
      }

      setGlyphs(sampleMarkGlyphs({ image, symbol, glyphScale: GLYPH_SCALE }));
    };

    image.src = src;

    return () => {
      isCancelled = true;
    };
  }, [src, symbol]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: a replay restarts the scramble
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!canvas || !ctx || glyphs.length === 0) {
      return;
    }

    const [highlight] = PLANET_PALETTES[symbol] ?? PLANET_PALETTES.USDC;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);

    canvas.width = ASCII_MARK_SIZE * pixelRatio;
    canvas.height = ASCII_MARK_SIZE * pixelRatio;
    ctx.scale(pixelRatio, pixelRatio);
    ctx.font = `bold ${7 * GLYPH_SCALE}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = highlight;

    const draw = (elapsedMs: number) => {
      ctx.clearRect(0, 0, ASCII_MARK_SIZE, ASCII_MARK_SIZE);

      glyphs.forEach((markGlyph, index) => {
        ctx.globalAlpha = 0.85 + 0.15 * markGlyph.strength;
        ctx.fillText(
          getScrambledGlyph({ glyph: markGlyph.glyph, index, elapsedMs }),
          markGlyph.x,
          markGlyph.y,
        );
      });

      ctx.globalAlpha = 1;
    };

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (!isOpen) {
      draw(Number.POSITIVE_INFINITY);
      return;
    }

    const startedAtMs = performance.now();
    let frame = 0;
    let lastTimeMs = 0;
    let isVisible = false;

    const tick = (timeMs: number) => {
      frame = window.requestAnimationFrame(tick);

      if (timeMs - lastTimeMs < SCRAMBLE_STEP_MS) {
        return;
      }

      lastTimeMs = timeMs;
      draw(timeMs - startedAtMs);
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
        // Leaving the loop mid-scramble would freeze digits in place.
        draw(Number.POSITIVE_INFINITY);
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
    motionQuery.addEventListener('change', syncLoop);

    draw(Number.POSITIVE_INFINITY);

    return () => {
      window.cancelAnimationFrame(frame);
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', syncLoop);
      window.removeEventListener('focus', syncLoop);
      window.removeEventListener('blur', syncLoop);
      motionQuery.removeEventListener('change', syncLoop);
      draw(Number.POSITIVE_INFINITY);
    };
  }, [glyphs, symbol, isOpen, replayToken]);

  if (glyphs.length === 0) {
    return <img className="lite-planet__mark-fallback" alt="" src={src} />;
  }

  return <canvas ref={canvasRef} className="lite-planet__mark" />;
};
