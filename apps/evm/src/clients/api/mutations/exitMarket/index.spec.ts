import fakeContractTransaction from '__mocks__/models/contractTransaction';
import { vBusd } from '__mocks__/models/vTokens';

import { LegacyPoolComptroller } from 'libs/contracts';

import exitMarket from '.';

describe('exitMarket', () => {
  test('returns contract transaction when request succeeds', async () => {
    const exitMarketMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      exitMarket: exitMarketMock,
    } as unknown as LegacyPoolComptroller;

    const response = await exitMarket({
      comptrollerContract: fakeContract,
      vToken: vBusd,
    });

    expect(response).toBe(fakeContractTransaction);
    expect(exitMarketMock).toHaveBeenCalledTimes(1);
    expect(exitMarketMock).toHaveBeenCalledWith(vBusd.address);
  });
});
