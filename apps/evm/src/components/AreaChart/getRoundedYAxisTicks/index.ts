const TICK_COUNT = 5;
const STEP_MULTIPLIERS = [1, 2, 2.5, 5, 10];

export const getRoundedYAxisTicks = (values: number[]) => {
  const finiteValues = values.filter(Number.isFinite);

  if (finiteValues.length === 0) {
    return undefined;
  }

  const minimum = Math.min(...finiteValues);
  const maximum = Math.max(...finiteValues);
  const extent = maximum - minimum || Math.max(Math.abs(maximum) * 0.2, 100);
  const rawStep = extent / (TICK_COUNT - 2);
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const step =
    (STEP_MULTIPLIERS.find(multiplier => multiplier * magnitude >= rawStep) ?? 10) * magnitude;

  let lowestTick = (Math.floor(minimum / step) - 1) * step;

  if (lowestTick + (TICK_COUNT - 1) * step < maximum) {
    lowestTick = Math.ceil(maximum / step) * step - (TICK_COUNT - 1) * step;
  }

  return Array.from({ length: TICK_COUNT }, (_, index) =>
    Number((lowestTick + index * step).toPrecision(12)),
  );
};
