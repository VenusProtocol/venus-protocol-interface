import { act, fireEvent, screen } from '@testing-library/react';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { useGetAccountPerformanceHistory } from 'clients/api';
import { NULL_ADDRESS } from 'constants/address';
import { useBreakpointUp } from 'hooks/responsive';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { en, t } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import { formatCentsToReadableValue } from 'utilities';
import { PerformanceChart } from '..';

const mockAreaChart = vi.hoisted(() => vi.fn());

vi.mock('components', async importOriginal => {
  const actual = await importOriginal<typeof import('components')>();

  return {
    ...actual,
    AreaChart: (props: unknown) => {
      mockAreaChart(props);
      return <div data-testid="area-chart" />;
    },
    InfoIcon: ({ tooltip }: { tooltip: React.ReactNode }) => (
      <span data-testid="info-icon">{tooltip}</span>
    ),
  };
});

vi.mock('hooks/responsive');

interface CapturedAreaChartProps {
  data: Array<{
    blockNumber: number;
    blockTimestampMs: number;
    netWorthCents: number;
  }>;
  interval: number;
  formatXAxisValue: (timestampMs: number) => string;
  formatYAxisValue: (valueCents: number) => string;
  onDataPointHover: (dataPoint: CapturedAreaChartProps['data'][number]) => void;
  onMouseLeave: () => void;
  xAxisDataKey: string;
  yAxisDataKey: string;
  yAxisTickCount: number;
}

const performanceHistory = [
  {
    blockNumber: 1,
    blockTimestampMs: 1714828100000,
    netWorthCents: 10000,
  },
  {
    blockNumber: 2,
    blockTimestampMs: 1714828200000,
    netWorthCents: 12500,
  },
];

const refetch = vi.fn();

const mockUseGetAccountPerformanceHistory = useGetAccountPerformanceHistory as Mock;
const mockUseBreakpointUp = useBreakpointUp as Mock;
const mockUseIsFeatureEnabled = useIsFeatureEnabled as Mock;

const render = (netWorthCents = 12000) =>
  renderComponent(<PerformanceChart netWorthCents={netWorthCents} />, {
    accountAddress: fakeAccountAddress,
  });

const mockPerformanceHistory = ({
  data = {
    performanceHistory,
    startOfDayNetWorthCents: 9000,
  },
  error,
  isLoading = false,
}: {
  data?: unknown;
  error?: Error;
  isLoading?: boolean;
} = {}) => {
  mockUseGetAccountPerformanceHistory.mockReturnValue({
    data,
    error,
    isLoading,
    refetch,
  });
};

describe('pages/Dashboard/PerformanceChart', () => {
  beforeEach(() => {
    refetch.mockClear();
    mockAreaChart.mockClear();
    mockUseBreakpointUp.mockReturnValue(false);
    mockUseIsFeatureEnabled.mockReturnValue(false);
    mockPerformanceHistory();
  });

  it('renders the loading placeholder when history is loading', () => {
    mockPerformanceHistory({ data: { performanceHistory: [] }, isLoading: true });

    render();

    expect(screen.getByText(en.account.performanceChart.placeholderText)).toBeInTheDocument();
    expect(screen.queryByTestId('area-chart')).not.toBeInTheDocument();
  });

  it('renders the error state and refetches on retry', () => {
    mockPerformanceHistory({ data: { performanceHistory: [] }, error: new Error('boom') });

    render();
    fireEvent.click(
      screen.getByRole('button', {
        name: en.account.performanceChart.errorState.refetchButtonLabel,
      }),
    );

    expect(
      screen.getByText(en.account.performanceChart.errorState.failedToFetchMessage),
    ).toBeInTheDocument();
    expect(refetch).toHaveBeenCalledOnce();
  });

  it('renders chart data and account performance values', () => {
    render();

    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    expect(screen.getByText(formatCentsToReadableValue({ value: 12000 }))).toBeInTheDocument();
    expect(screen.getByText('+$30')).toBeInTheDocument();
    expect(screen.getByText('25%').parentElement).toHaveClass('text-green');
    expect(screen.getByText('+$20')).toBeInTheDocument();

    const areaChartProps = mockAreaChart.mock.calls[0][0] as CapturedAreaChartProps;

    expect(areaChartProps).toEqual(
      expect.objectContaining({
        data: performanceHistory,
        interval: 4,
        xAxisDataKey: 'blockTimestampMs',
        yAxisDataKey: 'netWorthCents',
        yAxisTickCount: 5,
      }),
    );
    expect(areaChartProps.formatXAxisValue(performanceHistory[0].blockTimestampMs)).toBe(
      t('account.performanceChart.xAxisValue', {
        date: new Date(performanceHistory[0].blockTimestampMs),
      }),
    );
    expect(areaChartProps.formatYAxisValue(12500)).toBe(
      formatCentsToReadableValue({ value: 12500 }),
    );
  });

  it('uses a wider chart interval on larger screens', () => {
    mockUseBreakpointUp.mockReturnValue(true);

    render();

    const areaChartProps = mockAreaChart.mock.calls[0][0] as CapturedAreaChartProps;

    expect(areaChartProps.interval).toBe(5);
  });

  it('updates the selected period when clicking period buttons', () => {
    render();
    fireEvent.click(
      screen.getByRole('button', { name: en.account.performanceChart.periodOption.sixMonths }),
    );

    expect(mockUseGetAccountPerformanceHistory).toHaveBeenLastCalledWith({
      accountAddress: fakeAccountAddress,
      period: 'halfyear',
    });
  });

  it('uses NULL_ADDRESS when no account is connected', () => {
    renderComponent(<PerformanceChart netWorthCents={12000} />);

    expect(mockUseGetAccountPerformanceHistory).toHaveBeenLastCalledWith({
      accountAddress: NULL_ADDRESS,
      period: 'month',
    });
  });

  it('shows selected data point value while hovering over the chart', () => {
    render();

    const areaChartProps = mockAreaChart.mock.calls[0][0] as CapturedAreaChartProps;

    act(() => {
      areaChartProps.onDataPointHover(performanceHistory[1]);
    });

    expect(screen.getByText(formatCentsToReadableValue({ value: 12500 }))).toBeInTheDocument();
    expect(
      screen.getByText(
        t('account.performanceChart.dataPoint.date', {
          date: new Date(performanceHistory[1].blockTimestampMs),
        }),
      ),
    ).toBeInTheDocument();

    act(() => {
      areaChartProps.onMouseLeave();
    });

    expect(screen.getByText(formatCentsToReadableValue({ value: 12000 }))).toBeInTheDocument();
  });

  it('renders a negative daily change in red', () => {
    mockPerformanceHistory({
      data: {
        performanceHistory,
        startOfDayNetWorthCents: 15000,
      },
    });

    render();

    expect(screen.getByText('-$30')).toHaveClass('text-red');
    expect(screen.getByText('25%').parentElement).toHaveClass('text-red');
  });

  it('changes the net worth tooltip when the VAI feature is enabled', () => {
    mockUseIsFeatureEnabled.mockReturnValue(true);

    render();

    expect(
      screen.getByText(en.account.performanceChart.netWorth.tooltipWithVai),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(en.account.performanceChart.netWorth.tooltip),
    ).not.toBeInTheDocument();
  });
});
