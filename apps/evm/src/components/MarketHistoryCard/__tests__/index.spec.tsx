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
});
