import BigNumber from 'bignumber.js';

import { assetData } from '__mocks__/models/asset';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import { SimulationText } from '..';

const referenceValues = {
  userSupplyBalanceTokens: new BigNumber(10),
  userBorrowBalanceTokens: new BigNumber(0),
  userXvsStakedTokens: new BigNumber(1000),
};

describe('SimulationText', () => {
  it.each([
    [true, true],
    [false, false],
  ])(
    'mentions the boost comes from the Core pool only on Liquidity Hubs (%s)',
    (isLiquidityHub, shouldMention) => {
      const { container } = renderComponent(
        <SimulationText
          token={assetData[0].vToken.underlyingToken}
          type="supply"
          referenceValues={referenceValues}
          isLiquidityHub={isLiquidityHub}
        />,
      );

      expect(
        container.textContent?.includes(en.apy.primeBadge.tooltip.liquidityHubCorePoolBoost),
      ).toBe(shouldMention);
    },
  );
});
