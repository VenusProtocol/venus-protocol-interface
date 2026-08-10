import type { DataKey } from 'recharts/types/util/types';

export interface GetXAxisTicksInput<T extends Record<string, any>> {
  data: T[];
  interval?: number;
  xAxisDataKey: DataKey<T>;
}

export const getXAxisTicks = <T extends Record<string, any>>({
  data,
  interval,
  xAxisDataKey,
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

  const ticks = xAxisTickIndexes.map(dataIndex => {
    const dataPoint = data[dataIndex];

    if (typeof xAxisDataKey === 'function') {
      return xAxisDataKey(dataPoint);
    }

    return dataPoint[xAxisDataKey as string];
  });

  return ticks;
};
