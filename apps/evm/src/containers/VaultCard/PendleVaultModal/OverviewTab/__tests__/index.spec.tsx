import { fireEvent, screen } from '@testing-library/react';
import type { Mock } from 'vitest';

import { pendleVault } from '__mocks__/models/vaults';
import { useGetMarketChartData } from 'hooks/useGetMarketChartData';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import { OverviewTab } from '..';

const mockAreaChart = vi.hoisted(() => vi.fn());

vi.mock('components', async importOriginal => {
  const actual = await importOriginal<typeof import('components')>();

  return {
    ...actual,
    AreaChart: (props: unknown) => {
      mockAreaChart(props);
      return <div data-testid="supply-chart" />;
    },
  };
});

vi.mock('hooks/useGetMarketChartData');

const vault = pendleVault;

const supplyChartData = [
  {
    blockNumber: 1,
    blockTimestamp: 1714828100000,
    borrowApyPercentage: 1,
    supplyApyPercentage: 1,
    totalBorrowCents: 10000,
    totalSupplyCents: 10000,
  },
];

describe('containers/VaultCard/PendleVaultModal/OverviewTab', () => {
  beforeEach(() => {
    mockAreaChart.mockClear();
    (useGetMarketChartData as Mock).mockReturnValue({
      data: { supplyChartData },
      isLoading: false,
    });
  });

  it('renders total deposits chart, strategy, and market info', () => {
    renderComponent(<OverviewTab vault={vault} />);

    expect(screen.getAllByText(en.vault.modals.overview.totalDeposited).length).toBeGreaterThan(0);
    expect(screen.getByTestId('supply-chart')).toBeInTheDocument();
    expect(screen.getByText(en.vault.modals.overview.strategyAllocation)).toBeInTheDocument();
    expect(screen.getByText(en.vault.modals.overview.strategy.pendleRouter)).toBeInTheDocument();
    expect(screen.getByText(en.vault.modals.overview.strategy.venusCore)).toBeInTheDocument();
    expect(screen.getByText(en.vault.modals.overview.marketInfo)).toBeInTheDocument();
    expect(screen.getByText(vault.venueName)).toBeInTheDocument();
    expect(mockAreaChart).toHaveBeenCalledWith(
      expect.objectContaining({
        data: supplyChartData,
        yAxisDataKey: 'totalSupplyCents',
      }),
    );
  });

  it('changes the total deposits chart period', () => {
    renderComponent(<OverviewTab vault={vault} />);

    fireEvent.click(screen.getByRole('button', { name: en.market.periodOption.sixMonths }));

    expect(useGetMarketChartData).toHaveBeenLastCalledWith({
      period: 'halfyear',
      vToken: vault.asset.vToken,
    });
  });
});
