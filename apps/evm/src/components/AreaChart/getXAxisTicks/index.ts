import type { DataKey } from 'recharts/types/util/types';

export interface GetXAxisTicksInput<T extends Record<string, any>> {
  data: T[];
  interval?: number;
  xAxisDataKey: DataKey<T>;
  /**
   * Used to drop ticks that would render the same label as an earlier one, which happens when a
   * short history puts two ticks on the same day.
   */
  formatValue?: (value: any) => string;
}

export const getXAxisTicks = <T extends Record<string, any>>({
  data,
  interval,
  xAxisDataKey,
  formatValue,
}: GetXAxisTicksInput<T>): any[] | undefined => {
  if (typeof interval !== 'number') {
    return;
  }

  if (data.length === 0) {
    return [];
  }

  const xAxisTickCount = Math.min(Math.max(Math.round(interval), 1), data.length);
  const lastDataIndex = data.length - 1;

  const xAxisTickIndexes: number[] = [];

  if (xAxisTickCount === 1) {
    xAxisTickIndexes.push(0);
  } else {
    for (let n = 0; n < xAxisTickCount; n++) {
      const tickIndex = Math.round((n * lastDataIndex) / (xAxisTickCount - 1));

      xAxisTickIndexes.push(tickIndex);
    }
  }

  const ticks = xAxisTickIndexes
    .map(dataIndex => data[dataIndex])
    .filter(dataPoint => !!dataPoint)
    .map(dataPoint =>
      typeof xAxisDataKey === 'function'
        ? xAxisDataKey(dataPoint)
        : dataPoint[xAxisDataKey as string],
    );

  if (!formatValue) {
    return ticks;
  }

  const seenLabels = new Set<string>();

  return ticks.filter(tick => {
    const label = formatValue(tick);

    if (seenLabels.has(label)) {
      return false;
    }

    seenLabels.add(label);
    return true;
  });
};
