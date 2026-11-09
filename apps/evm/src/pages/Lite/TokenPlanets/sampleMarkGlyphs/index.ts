export const ASCII_MARK_SIZE = 288;

const BASE_GRID = 48;
const SIMPLIFIED_GRID = 24;
const SIMPLIFIED_SOURCE_SIZE = 128;
const SIMPLIFIED_PADDING = 1.12;
const BASE_FONT_SIZE = 7;
const OPAQUE_THRESHOLD = 100;
const DEFAULT_STRENGTH_THRESHOLD = 0.82;
const MAX_LUMINANCE = 765;

const INVERTED_SYMBOLS = ['sUSDe', 'ETH'];
const SIMPLIFIED_SYMBOLS = ['XVS', 'BNB', 'WBNB', 'U', 'ETH', 'USD1'];

const STRENGTH_THRESHOLDS: Record<string, number> = {
  ETH: 0.3,
  USD1: 0.72,
  XVS: 0.25,
  U: 0.5,
};

const MARK_WEIGHTS: Record<string, number> = {
  ETH: 1.4,
};

const DEFAULT_MARK_WEIGHT = 1.2;

export interface MarkGlyph {
  x: number;
  y: number;
  strength: number;
  glyph: string;
}

export interface MarkGlyphs {
  glyphs: MarkGlyph[];
  fontSize: number;
}

const getForegroundBounds = ({
  size,
  isForeground,
}: {
  size: number;
  isForeground: (offset: number) => boolean;
}) => {
  let left = size;
  let top = size;
  let right = -1;
  let bottom = -1;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!isForeground((y * size + x) * 4)) {
        continue;
      }

      left = Math.min(left, x);
      right = Math.max(right, x);
      top = Math.min(top, y);
      bottom = Math.max(bottom, y);
    }
  }

  return right < left ? undefined : { left, top, right, bottom };
};

export const sampleMarkGlyphs = ({
  image,
  symbol,
  glyphScale,
}: {
  image: HTMLImageElement;
  symbol: string;
  glyphScale: number;
}): MarkGlyphs => {
  const isSimplified = SIMPLIFIED_SYMBOLS.includes(symbol);
  const grid = isSimplified ? SIMPLIFIED_GRID : Math.round(BASE_GRID / glyphScale);
  const step = ASCII_MARK_SIZE / grid;
  const fontSize = isSimplified
    ? step * (MARK_WEIGHTS[symbol] ?? DEFAULT_MARK_WEIGHT)
    : BASE_FONT_SIZE * glyphScale;
  const empty: MarkGlyphs = { glyphs: [], fontSize };

  const source = document.createElement('canvas');
  const sourceSize = isSimplified ? SIMPLIFIED_SOURCE_SIZE : grid;
  source.width = sourceSize;
  source.height = sourceSize;

  const sampler = source.getContext('2d', { willReadFrequently: true });

  if (!sampler) {
    return empty;
  }

  const isInverted = INVERTED_SYMBOLS.includes(symbol);
  const threshold = STRENGTH_THRESHOLDS[symbol] ?? DEFAULT_STRENGTH_THRESHOLD;

  const getStrength = (data: Uint8ClampedArray, offset: number) => {
    const luminance = (data[offset] + data[offset + 1] + data[offset + 2]) / MAX_LUMINANCE;
    return isInverted ? 1 - luminance : luminance;
  };

  const isForeground = (data: Uint8ClampedArray, offset: number) =>
    data[offset + 3] >= OPAQUE_THRESHOLD && getStrength(data, offset) >= threshold;

  try {
    sampler.drawImage(image, 0, 0, sourceSize, sourceSize);

    if (isSimplified) {
      const sourceData = sampler.getImageData(0, 0, sourceSize, sourceSize).data;
      const bounds = getForegroundBounds({
        size: sourceSize,
        isForeground: offset => isForeground(sourceData, offset),
      });

      if (!bounds) {
        return empty;
      }

      const span =
        Math.max(bounds.right - bounds.left + 1, bounds.bottom - bounds.top + 1) *
        SIMPLIFIED_PADDING;
      const cropX = (bounds.left + bounds.right + 1 - span) / 2;
      const cropY = (bounds.top + bounds.bottom + 1 - span) / 2;

      source.width = grid;
      source.height = grid;
      sampler.drawImage(
        image,
        (cropX / sourceSize) * image.naturalWidth,
        (cropY / sourceSize) * image.naturalHeight,
        (span / sourceSize) * image.naturalWidth,
        (span / sourceSize) * image.naturalHeight,
        0,
        0,
        grid,
        grid,
      );
    }

    const { data } = sampler.getImageData(0, 0, grid, grid);
    const glyphs: MarkGlyph[] = [];

    for (let y = 0; y < grid; y++) {
      for (let x = 0; x < grid; x++) {
        const offset = (y * grid + x) * 4;

        if (!isForeground(data, offset)) {
          continue;
        }

        glyphs.push({
          x: (x + 0.5) * step,
          y: (y + 0.5) * step,
          strength: getStrength(data, offset),
          glyph: (x + y) % 3 === 0 ? '@' : '#',
        });
      }
    }

    return { glyphs, fontSize };
  } catch {
    return empty;
  }
};
