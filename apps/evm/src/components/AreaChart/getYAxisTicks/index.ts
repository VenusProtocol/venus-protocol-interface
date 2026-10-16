import type { DataKey } from 'recharts/types/util/types';

export interface GetYAxisTicksInput<T extends Record<string, any>> {
  data: T[];
  tickCount: number;
  yAxisDataKey: DataKey<T>;
  /**
   * Used to drop ticks that would render the same label as an earlier one, which happens when the
   * values of a history sit within a range narrower than the precision of the label.
   */
  formatValue: (value: any) => string;
}

export const getYAxisTicks = <T extends Record<string, any>>({
  data,
  tickCount,
  yAxisDataKey,
  formatValue,
}: GetYAxisTicksInput<T>): number[] | undefined => {
  const values = data
    .map(dataPoint => Number(dataPoint[yAxisDataKey as keyof T]))
    .filter(value => Number.isFinite(value));

  if (values.length === 0 || tickCount < 2) {
    return;
  }

  const lowestValue = Math.min(...values);
  const highestValue = Math.max(...values);

  if (lowestValue === highestValue) {
    return [lowestValue];
  }

  const step = (highestValue - lowestValue) / (tickCount - 1);
  const seenLabels = new Set<string>();

  return Array.from({ length: tickCount }, (_item, index) => lowestValue + step * index).filter(
    tick => {
      const label = formatValue(tick);

      if (seenLabels.has(label)) {
        return false;
      }

      seenLabels.add(label);
      return true;
    },
  );
};
