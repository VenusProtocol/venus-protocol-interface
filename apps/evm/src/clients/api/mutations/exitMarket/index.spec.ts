import fakeContractTransaction from '__mocks__/models/contractTransaction';
import fakeSigner from '__mocks__/models/signer';
import { vBusd } from '__mocks__/models/vTokens';

import type { LegacyPoolComptroller } from 'libs/contracts';

import exitMarket from '.';

describe('exitMarket', () => {
  test('returns contract transaction when request succeeds', async () => {
    const exitMarketMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      functions: {
        exitMarket: exitMarketMock,
      },
      signer: fakeSigner,
    } as unknown as LegacyPoolComptroller;

    const response = exitMarket({
      comptrollerContract: fakeContract,
      vToken: vBusd,
    });

    expect(response).toStrictEqual({
      contract: fakeContract,
      args: [vBusd.address],
      methodName: 'exitMarket',
    });
  });
});
