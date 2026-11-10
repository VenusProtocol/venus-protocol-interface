import BigNumber from 'bignumber.js';

import { assetData } from '__mocks__/models/asset';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import { SimulationText } from '..';

const referenceValues = {
  userSupplyBalanceTokens: new BigNumber(10),
  userBorrowBalanceTokens: new BigNumber(0),
  userXvsStakedTokens: new BigNumber(1000),
  referenceType: 'average' as const,
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

  it.each([
    ['supply' as const, en.apy.primeBadge.tooltip.primeSupplySimulationCapped],
    ['borrow' as const, en.apy.primeBadge.tooltip.primeBorrowSimulationCapped],
  ])('uses the capped copy when the %s reference is the cap', (type, copy) => {
    const { container } = renderComponent(
      <SimulationText
        token={assetData[0].vToken.underlyingToken}
        type={type}
        referenceValues={{ ...referenceValues, referenceType: 'cap' }}
      />,
    );

    const capSuffix = copy.slice(copy.lastIndexOf('('));

    expect(container.textContent).toContain(capSuffix);
    expect(container.textContent).not.toContain('average user');
  });
});
