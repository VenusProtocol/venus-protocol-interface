import { theme } from '@venusprotocol/ui';
import type { Mock } from 'vitest';

import { useBreakpointUp } from 'hooks/responsive';
import { renderComponent } from 'testUtils/render';
import { UnitPriceChart, type UnitPriceHistoryDataPoint } from '..';

const mockAreaChart = vi.hoisted(() => vi.fn());

vi.mock('components', async importOriginal => {
  const actual = await importOriginal<typeof import('components')>();

  return {
    ...actual,
    AreaChart: (props: unknown) => {
      mockAreaChart(props);
      return null;
    },
  };
});

vi.mock('hooks/responsive');

interface CapturedAreaChartProps {
  data: UnitPriceHistoryDataPoint[];
  xAxisDataKey: string;
  yAxisDataKey: string;
  chartColor: string;
  interval: number;
  formatXAxisValue: (timestampMs: number) => string;
  formatYAxisValue: (unitPrice: number) => string;
  formatTooltipItems: (dataPoint: UnitPriceHistoryDataPoint) => Array<{
    label: string;
    value: string;
  }>;
}

const data: UnitPriceHistoryDataPoint[] = [
  {
    timestampMs: 1652766150000,
    unitPrice: 1.01976,
  },
];

describe('UnitPriceChart', () => {
  const mockUseBreakpointUp = useBreakpointUp as Mock;

  beforeEach(() => {
    mockAreaChart.mockClear();
    mockUseBreakpointUp.mockReturnValue(false);
  });

  it('configures the area chart and formats unit price values', () => {
    renderComponent(<UnitPriceChart data={data} selectedPeriod="month" />);

    expect(mockAreaChart).toHaveBeenCalledOnce();
    const areaChartProps = mockAreaChart.mock.calls[0][0] as CapturedAreaChartProps;

    expect(areaChartProps).toEqual(
      expect.objectContaining({
        chartColor: theme.colors.blue,
        data,
        interval: 3,
        xAxisDataKey: 'timestampMs',
        yAxisDataKey: 'unitPrice',
      }),
    );
    expect(areaChartProps.formatXAxisValue(data[0].timestampMs)).toEqual(expect.any(String));
    expect(areaChartProps.formatYAxisValue(data[0].unitPrice)).toBe('1.0197');
    expect(areaChartProps.formatTooltipItems(data[0])).toEqual([
      {
        label: 'Date',
        value: expect.any(String),
      },
      {
        label: 'Unit price',
        value: '1.0197',
      },
    ]);
  });

  it('uses the wider chart interval on larger screens', () => {
    mockUseBreakpointUp.mockReturnValue(true);

    renderComponent(<UnitPriceChart data={data} selectedPeriod="month" />);

    const areaChartProps = mockAreaChart.mock.calls[0][0] as CapturedAreaChartProps;

    expect(areaChartProps.interval).toBe(5);
  });
});
