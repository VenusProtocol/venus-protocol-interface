import BigNumber from 'bignumber.js';

import { xvs } from '__mocks__/models/tokens';
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

const history = {
  type: 'borrow' as const,
  data: [
    { blockTimestamp: 1, borrowApyPercentage: 0 },
    { blockTimestamp: 2, borrowApyPercentage: 0 },
  ],
  isLoading: false,
  selectedPeriod: '1m' as const,
  setSelectedPeriod: vi.fn(),
  periodOptions: [{ label: '1M', value: '1m' as const }],
};

describe('MarketHistoryCard', () => {
  it('shows an average APY of 0% given by the API', () => {
    const { container } = renderComponent(
      <MarketHistoryCard
        title="Borrow info"
        cells={[]}
        cap={cap}
        history={history}
        averageApyPercentage={0}
      />,
    );

    expect(container.textContent).toContain(`${en.market.stats.averageApy}0%`);
  });

  it('shows an average APY of 0% computed from a history of zeros', () => {
    const { container } = renderComponent(
      <MarketHistoryCard title="Borrow info" cells={[]} cap={cap} history={history} />,
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
