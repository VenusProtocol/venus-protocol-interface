import { MainPoolComptroller } from 'packages/contracts';

import fakeContractTransaction from '__mocks__/models/contractTransaction';
import { vBusd } from '__mocks__/models/vTokens';

import enterMarket from '.';

describe('enterMarket', () => {
  test('returns contract transaction when request succeeds', async () => {
    const enterMarketsMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      enterMarkets: enterMarketsMock,
    } as unknown as MainPoolComptroller;

    const response = await enterMarket({
      comptrollerContract: fakeContract,
      vToken: vBusd,
    });

    expect(response).toBe(fakeContractTransaction);
    expect(enterMarketsMock).toHaveBeenCalledTimes(1);
    expect(enterMarketsMock).toHaveBeenCalledWith([vBusd.address]);
  });
});
