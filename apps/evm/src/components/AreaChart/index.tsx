import type { ChartTooltipContentItem } from 'components';
import type { DataKey, Margin } from 'recharts/types/util/types';

import { SectionErrorBoundary } from '../SectionErrorBoundary';
import { AreaChartContent } from './AreaChartContent';

export interface AreaChartProps<T extends Record<string, any>> {
  data: T[];
  xAxisDataKey: DataKey<T>;
  yAxisDataKey: DataKey<T>;
  chartColor: string;
  formatXAxisValue: (value: any) => string;
  formatYAxisValue: (value: any) => string;
  yAxisTickCount?: number;
  onDataPointHover?: (value: T) => void;
  onMouseLeave?: () => void;
  formatTooltipItems?: (value: T) => ChartTooltipContentItem[];
  areaChartMargin?: Margin;
  /** Maximum number of labels to display on the X axis. */
  interval?: number;
  displayAxes?: boolean;
  displayToolTip?: boolean;
  className?: string;
}

// Charts depend on the shape of remote data (e.g. a period with fewer points than expected), so an
// unexpected payload must not take down the page embedding the chart.
export const AreaChart = <T extends Record<string, any>>(props: AreaChartProps<T>) => (
  <SectionErrorBoundary className="my-4">
    <AreaChartContent {...props} />
  </SectionErrorBoundary>
);
