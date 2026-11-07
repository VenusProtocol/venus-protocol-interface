export const ASCII_MARK_SIZE = 288;

const BASE_GRID = 48;
const OPAQUE_THRESHOLD = 100;
const STRENGTH_THRESHOLD = 0.82;
const MAX_LUMINANCE = 765;

const INVERTED_SYMBOLS = ['sUSDe', 'ETH'];

export interface MarkGlyph {
  x: number;
  y: number;
  strength: number;
  glyph: string;
}

export const sampleMarkGlyphs = ({
  image,
  symbol,
  glyphScale,
}: {
  image: HTMLImageElement;
  symbol: string;
  glyphScale: number;
}): MarkGlyph[] => {
  const grid = Math.round(BASE_GRID / glyphScale);
  const source = document.createElement('canvas');
  source.width = grid;
  source.height = grid;

  const sampler = source.getContext('2d', { willReadFrequently: true });

  if (!sampler) {
    return [];
  }

  const isInverted = INVERTED_SYMBOLS.includes(symbol);
  const step = ASCII_MARK_SIZE / grid;
  const glyphs: MarkGlyph[] = [];

  try {
    sampler.drawImage(image, 0, 0, grid, grid);
    const { data } = sampler.getImageData(0, 0, grid, grid);

    for (let y = 0; y < grid; y++) {
      for (let x = 0; x < grid; x++) {
        const offset = (y * grid + x) * 4;
        const luminance = (data[offset] + data[offset + 1] + data[offset + 2]) / MAX_LUMINANCE;
        const strength = isInverted ? 1 - luminance : luminance;

        if (data[offset + 3] < OPAQUE_THRESHOLD || strength < STRENGTH_THRESHOLD) {
          continue;
        }

        glyphs.push({
          x: (x + 0.5) * step,
          y: (y + 0.5) * step,
          strength,
          glyph: (x + y) % 3 === 0 ? '@' : '#',
        });
      }
    }
  } catch {
    return [];
  }

  return glyphs;
};
