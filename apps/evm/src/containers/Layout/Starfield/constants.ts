export const STAR_FIELD = {
  referenceViewport: { width: 1440, height: 836 },
  counts: { dust: 500, bright: 48, glint: 5 },
  areaScale: { min: 0.16, max: 1.35 },
  distribution: {
    upperRightShare: 0.45,
    upperRightStartX: 0.48,
    upperRightTopY: 0.04,
    upperRightHeight: 0.66,
    contentDim: 0.18,
  },
  size: {
    dust: [2.1, 4.2],
    bright: [4.2, 6],
    glint: [7, 10],
  },
  brightness: {
    dust: [0.38, 0.62],
    bright: [0.72, 0.94],
    glint: [0.9, 1],
  },
  colors: {
    dust: [0.7, 0.82, 0.95],
    blueDust: [0.42, 0.71, 1],
    bright: [0.84, 0.92, 1],
    warmDust: [1, 0.58, 0.34],
    warmBright: [1, 0.76, 0.52],
    blueDustShare: 0.18,
  },
  twinkle: {
    cyclesPerSecond: [0.07, 0.18],
    minimumBrightness: 0.5,
  },
  drift: {
    pixelsPerSecond: [2.8, 6],
    wrapMarginPixels: 16,
    verticalAmplitudePixels: [1.5, 3],
    verticalWavelengthPixels: [60, 140],
  },
} as const;

export const STAR_TUNING = {
  stars: 2200,
  warmth: 0.02,
  brightness: 1.8,
  size: 0.9,
  twinkle: 0.3,
  drift: 0.45,
} as const;

export const STILL_STAR_COUNT = 2200;
export const STILL_STAR_SIZE = 0.9;
export const STILL_STAR_BRIGHTNESS = 2.4;
export const STILL_STAR_COLOR = '#b8d8ff';
export const STILL_STAR_VIEWPORT = { width: 1440, height: 900 };
