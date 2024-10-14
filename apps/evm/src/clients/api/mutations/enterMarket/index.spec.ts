import fakeContractTransaction from '__mocks__/models/contractTransaction';
import fakeSigner from '__mocks__/models/signer';
import { vBusd } from '__mocks__/models/vTokens';

import type { LegacyPoolComptroller } from 'libs/contracts';

import enterMarket from '.';

describe('enterMarket', () => {
  test('returns contract transaction when request succeeds', async () => {
    const enterMarketsMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      functions: {
        enterMarkets: enterMarketsMock,
      },
      signer: fakeSigner,
    } as unknown as LegacyPoolComptroller;

    const response = await enterMarket({
      comptrollerContract: fakeContract,
      vToken: vBusd,
    });

    expect(response).toStrictEqual({
      contract: fakeContract,
      args: [[vBusd.address]],
      methodName: 'enterMarkets',
    });
  });
});
