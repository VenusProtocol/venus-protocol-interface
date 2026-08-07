import { theme } from '@venusprotocol/ui';
import type { Mock } from 'vitest';

import { useBreakpointUp } from 'hooks/responsive';
import { renderComponent } from 'testUtils/render';
import type { LiquidityHubSnapshot } from 'types';
import { UnitPriceChart } from '..';

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
  data: LiquidityHubSnapshot[];
  xAxisDataKey: string;
  yAxisDataKey: string;
  chartColor: string;
  interval: number;
  formatXAxisValue: (timestampMs: number) => string;
  formatYAxisValue: (unitPrice: number) => string;
  formatTooltipItems: (dataPoint: LiquidityHubSnapshot) => Array<{
    label: string;
    value: string;
  }>;
}

const data: LiquidityHubSnapshot[] = [
  {
    blockNumber: 1,
    blockTimestamp: 1652766150000,
    pricePerShare: 1.01976,
    supplyApyPercentage: 1,
    totalSupplyCents: 10000,
  },
];

describe('UnitPriceChart', () => {
  const mockUseBreakpointUp = useBreakpointUp as Mock;

  beforeEach(() => {
    mockAreaChart.mockClear();
    mockUseBreakpointUp.mockReturnValue(false);
  });

  it('configures the area chart and formats unit price values', () => {
    renderComponent(<UnitPriceChart data={data} selectedPeriod="1m" />);

    expect(mockAreaChart).toHaveBeenCalledOnce();
    const areaChartProps = mockAreaChart.mock.calls[0][0] as CapturedAreaChartProps;

    expect(areaChartProps).toEqual(
      expect.objectContaining({
        chartColor: theme.colors.blue,
        data,
        interval: 3,
        xAxisDataKey: 'blockTimestamp',
        yAxisDataKey: 'pricePerShare',
      }),
    );
    expect(areaChartProps.formatXAxisValue(data[0].blockTimestamp)).toEqual(expect.any(String));
    expect(areaChartProps.formatYAxisValue(data[0].pricePerShare)).toBe('1.0197');
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

    renderComponent(<UnitPriceChart data={data} selectedPeriod="1m" />);

    const areaChartProps = mockAreaChart.mock.calls[0][0] as CapturedAreaChartProps;

    expect(areaChartProps.interval).toBe(5);
  });
});
