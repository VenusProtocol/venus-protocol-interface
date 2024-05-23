import { BigNumber as BN } from 'ethers';

import { vXvs } from '__mocks__/models/vTokens';
import type { IsolatedPoolComptroller } from 'libs/contracts';

import { getIsolatedPoolVTokenLiquidationThreshold } from '.';

describe('getIsolatedPoolVTokenLiquidationThreshold', () => {
  test('returns the liquidation threshold percentage on success', async () => {
    const fakeLiquidationThresholdMantissa = BN.from('1000000000000000000');

    const getMarketMock = vi.fn(async () => ({
      liquidationThresholdMantissa: fakeLiquidationThresholdMantissa,
    }));

    const fakeContract = {
      markets: getMarketMock,
    } as unknown as IsolatedPoolComptroller;

    const response = await getIsolatedPoolVTokenLiquidationThreshold({
      poolComptrollerContract: fakeContract,
      vTokenAddress: vXvs.address,
    });

    expect(getMarketMock).toHaveBeenCalledTimes(1);
    expect(response).toMatchInlineSnapshot(`
      {
        "liquidationThresholdPercentage": 100,
      }
    `);
  });
});
