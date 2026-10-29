/** Engaged planets cycle their glyphs through digits. */
export const SCRAMBLE_STEP_MS = 160;

export const getScrambledGlyph = ({
  glyph,
  index,
  elapsedMs,
}: {
  glyph: string;
  index: number;
  elapsedMs: number;
}) => {
  if (elapsedMs < 0 || !Number.isFinite(elapsedMs)) {
    return glyph;
  }

  return String((index + Math.floor(elapsedMs / SCRAMBLE_STEP_MS)) % 10);
};
