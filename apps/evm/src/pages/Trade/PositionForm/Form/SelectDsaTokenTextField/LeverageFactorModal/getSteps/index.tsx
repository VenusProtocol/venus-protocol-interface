export const STEP_COUNT = 6;

export const getSteps = ({
  min,
  max,
}: {
  min: number;
  max: number;
}): number[] => {
  const scale = 100;
  const minUnits = Math.round(min * scale);
  const maxUnits = Math.round(max * scale);
  const rangeUnits = maxUnits - minUnits;

  return Array.from({ length: STEP_COUNT }, (_, i) => {
    const units = Math.round(minUnits + (rangeUnits * i) / (STEP_COUNT - 1));
    return units / scale;
  });
};
