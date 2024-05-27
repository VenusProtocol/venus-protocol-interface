import { BigNumber as BN } from 'ethers';

import type { IsolatedPoolComptroller } from 'libs/contracts';

import { getPoolLiquidationIncentive } from '.';

describe('getPoolLiquidationIncentive', () => {
  test('returns the liquidation incentive percentage on success', async () => {
    const fakeLiquidationIncentiveMantissa = BN.from('2000000000000000000');

    const getLiquidationIncentiveMantissaMock = vi.fn(async () => fakeLiquidationIncentiveMantissa);

    const fakeContract = {
      liquidationIncentiveMantissa: getLiquidationIncentiveMantissaMock,
    } as unknown as IsolatedPoolComptroller;

    const response = await getPoolLiquidationIncentive({
      poolComptrollerContract: fakeContract,
    });

    expect(getLiquidationIncentiveMantissaMock).toHaveBeenCalledTimes(1);
    expect(response).toMatchInlineSnapshot(`
      {
        "liquidationIncentivePercentage": 100,
      }
    `);
  });
});
