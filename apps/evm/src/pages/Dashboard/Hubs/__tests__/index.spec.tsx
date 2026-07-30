import BigNumber from 'bignumber.js';

import { liquidityHubs as fakeLiquidityHubs } from '__mocks__/models/liquidityHubs';
import { renderComponent } from 'testUtils/render';
import type { LiquidityHub } from 'types';
import { Hubs } from '..';

const liquidityHubsWithoutPositions: LiquidityHub[] = fakeLiquidityHubs.map(liquidityHub => ({
  ...liquidityHub,
  userSupplyBalanceCents: new BigNumber(0),
  userSupplyBalanceTokens: new BigNumber(0),
  userYearlyEarningsCents: new BigNumber(0),
}));

describe('Hubs', () => {
  it('displays content correctly', async () => {
    const { container } = renderComponent(<Hubs liquidityHubs={fakeLiquidityHubs} />);

    expect(container.textContent).toMatchSnapshot();
  });

  it('displays placeholder when there are no hubs to display', async () => {
    const { container } = renderComponent(<Hubs liquidityHubs={liquidityHubsWithoutPositions} />);

    expect(container.textContent).toMatchSnapshot();
  });
});
