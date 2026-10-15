import { fireEvent } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import { xvs } from '__mocks__/models/tokens';
import { type UseIsFeatureEnabledInput, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';

import { MarketHistoryCard } from '..';

const cap = {
  token: xvs,
  title: 'Total borrowed',
  tokenPriceCents: new BigNumber(100),
  limitTokens: new BigNumber(1000),
  valueTokens: new BigNumber(0),
};

const periodOptions = [
  { label: '30D', value: 'month' as const },
  { label: '1Y', value: 'year' as const },
];

const baseHistory = {
  type: 'borrow' as const,
  data: [],
  isLoading: false,
  selectedPeriod: 'year' as const,
  setSelectedPeriod: vi.fn(),
  periodOptions,
};

describe('MarketHistoryCard', () => {
  beforeEach(() => {
    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabledInput) => name === 'apyCharts',
    );
  });

  it('keeps the period buttons when the selected period has no data', () => {
    const { getByText } = renderComponent(
      <MarketHistoryCard title="Borrow info" cells={[]} cap={cap} history={baseHistory} />,
    );

    periodOptions.forEach(periodOption =>
      expect(getByText(periodOption.label)).toBeInTheDocument(),
    );
  });

  it('lets the user switch back to another period when the selected one has no data', () => {
    const setSelectedPeriod = vi.fn();

    const { getByText } = renderComponent(
      <MarketHistoryCard
        title="Borrow info"
        cells={[]}
        cap={cap}
        history={{ ...baseHistory, setSelectedPeriod }}
      />,
    );

    fireEvent.click(getByText('30D'));

    expect(setSelectedPeriod).toHaveBeenCalledWith('month');
  });

  it('displays an empty state when the selected period has no data', () => {
    const { getByText } = renderComponent(
      <MarketHistoryCard title="Borrow info" cells={[]} cap={cap} history={baseHistory} />,
    );

    expect(getByText(en.market.history.emptyState)).toBeInTheDocument();
  });

  it('displays an error state with a retry action when fetching the history failed', () => {
    const refetch = vi.fn();

    const { getByText } = renderComponent(
      <MarketHistoryCard
        title="Borrow info"
        cells={[]}
        cap={cap}
        history={{ ...baseHistory, error: new Error('fake error'), refetch }}
      />,
    );

    expect(getByText(en.market.history.errorState.failedToFetchMessage)).toBeInTheDocument();

    fireEvent.click(getByText(en.market.history.errorState.refetchButtonLabel));

    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it('displays the chart when the selected period has data', () => {
    const { queryByText } = renderComponent(
      <MarketHistoryCard
        title="Borrow info"
        cells={[]}
        cap={cap}
        history={{
          ...baseHistory,
          data: [
            { blockTimestamp: 1, borrowApyPercentage: 1 },
            { blockTimestamp: 2, borrowApyPercentage: 2 },
          ],
        }}
      />,
    );

    expect(queryByText(en.market.history.emptyState)).toBeNull();
    expect(queryByText(en.market.legends.borrowApy)).toBeInTheDocument();
  });

  describe('average APY', () => {
    const zeroHistory = {
      ...baseHistory,
      data: [
        { blockTimestamp: 1, borrowApyPercentage: 0 },
        { blockTimestamp: 2, borrowApyPercentage: 0 },
      ],
    };

    it('shows an average APY of 0% given by the API', () => {
      const { container } = renderComponent(
        <MarketHistoryCard
          title="Borrow info"
          cells={[]}
          cap={cap}
          history={zeroHistory}
          averageApyPercentage={0}
        />,
      );

      expect(container.textContent).toContain(`${en.market.stats.averageApy}0%`);
    });

    it('shows an average APY of 0% computed from a history of zeros', () => {
      const { container } = renderComponent(
        <MarketHistoryCard title="Borrow info" cells={[]} cap={cap} history={zeroHistory} />,
      );

      expect(container.textContent).toContain(`${en.market.stats.averageApy}0%`);
    });

    it('hides the average APY when there is no history', () => {
      const { container } = renderComponent(
        <MarketHistoryCard title="Borrow info" cells={[]} cap={cap} />,
      );

      expect(container.textContent).not.toContain(en.market.stats.averageApy);
    });
  });
});
