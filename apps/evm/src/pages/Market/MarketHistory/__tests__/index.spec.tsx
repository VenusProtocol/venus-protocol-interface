import { fireEvent, screen, within } from '@testing-library/react';
import BigNumber from 'bignumber.js';

import { assetData } from '__mocks__/models/asset';
import { renderComponent } from 'testUtils/render';
import type { Asset } from 'types';
import { MarketHistory } from '..';
import TEST_IDS from '../../testIds';

beforeAll(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});

const openBorrowCapTooltip = async (readableThresholdPercentage: string) => {
  const trigger = within(screen.getByTestId(TEST_IDS.borrowInfo)).getByText(
    readableThresholdPercentage,
  );
  fireEvent.pointerMove(trigger);
  fireEvent.pointerEnter(trigger);

  const [tooltip] = await screen.findAllByText(/Maximum amount available to borrow/);
  return tooltip;
};

describe('MarketHistory', () => {
  const asset: Asset = {
    ...assetData[0],
    tokenPriceCents: new BigNumber(100),
    borrowBalanceTokens: new BigNumber(200),
    borrowCapTokens: new BigNumber(1000),
    cashTokens: new BigNumber(50),
  };

  it('caps the displayed borrow cap to the market liquidity', async () => {
    renderComponent(<MarketHistory asset={asset} />);

    const borrowInfo = screen.getByTestId(TEST_IDS.borrowInfo);
    expect(borrowInfo.textContent).toContain('$200 / $250');
    expect(borrowInfo.textContent).toContain('200 / 250 XVS');

    const tooltip = await openBorrowCapTooltip('80%');
    expect(tooltip.textContent).toContain('$50');
    expect(tooltip.textContent).toContain('50 XVS');
    expect(tooltip.textContent).toContain('Borrow cap: 1K XVS');
  });

  it('displays the borrow cap when the market liquidity is higher', async () => {
    renderComponent(<MarketHistory asset={{ ...asset, cashTokens: new BigNumber(5000) }} />);

    const borrowInfo = screen.getByTestId(TEST_IDS.borrowInfo);
    expect(borrowInfo.textContent).toContain('$200 / $1K');
    expect(borrowInfo.textContent).toContain('200 / 1K XVS');

    const tooltip = await openBorrowCapTooltip('20%');
    expect(tooltip.textContent).toContain('$800');
    expect(tooltip.textContent).toContain('800 XVS');
  });
});
