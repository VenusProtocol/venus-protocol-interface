const TICK_COUNT = 5;
const STEP_MULTIPLIERS = [1, 2, 2.5, 5];
const MAX_MAGNITUDE_INCREASES = 12;

const buildTicks = ({
  minimum,
  maximum,
  step,
}: {
  minimum: number;
  maximum: number;
  step: number;
}) => {
  let lowestTick = (Math.floor(minimum / step) - 1) * step;

  if (minimum >= 0) {
    lowestTick = Math.max(lowestTick, 0);
  }

  if (lowestTick + (TICK_COUNT - 1) * step < maximum) {
    lowestTick = Math.ceil(maximum / step) * step - (TICK_COUNT - 1) * step;
  }

  return Array.from({ length: TICK_COUNT }, (_, index) =>
    Number((lowestTick + index * step).toPrecision(12)),
  );
};

const hasDistinctLabels = ({
  ticks,
  formatValue,
}: {
  ticks: number[];
  formatValue: (value: number) => string;
}) => new Set(ticks.map(formatValue)).size === ticks.length;

export const getRoundedYAxisTicks = (values: number[], formatValue?: (value: number) => string) => {
  const finiteValues = values.filter(Number.isFinite);

  if (finiteValues.length === 0) {
    return undefined;
  }

  const minimum = Math.min(...finiteValues);
  const maximum = Math.max(...finiteValues);
  const extent = maximum - minimum || Math.max(Math.abs(maximum) * 0.2, 100);
  const rawStep = extent / (TICK_COUNT - 2);
  const baseMagnitude = 10 ** Math.floor(Math.log10(rawStep));

  let ticks: number[] = [];

  for (
    let magnitudeIncrease = 0;
    magnitudeIncrease <= MAX_MAGNITUDE_INCREASES;
    magnitudeIncrease++
  ) {
    const magnitude = baseMagnitude * 10 ** magnitudeIncrease;

    for (const multiplier of STEP_MULTIPLIERS) {
      const step = multiplier * magnitude;

      if (step < rawStep) {
        continue;
      }

      ticks = buildTicks({ minimum, maximum, step });

      if (!formatValue || hasDistinctLabels({ ticks, formatValue })) {
        return ticks;
      }
    }
  }

  return ticks;
};
