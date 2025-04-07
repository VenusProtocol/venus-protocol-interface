import fakeAddress from '__mocks__/models/address';
import fakeContractTransaction from '__mocks__/models/contractTransaction';
import fakeSigner from '__mocks__/models/signer';

import type { Erc20 } from 'libs/contracts';

import approveToken from '.';

describe('revokeSpendingLimit', () => {
  test('returns contract transaction when request succeeds', async () => {
    const approveTokenMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      functions: {
        approve: approveTokenMock,
      },
      signer: fakeSigner,
    } as unknown as Erc20;

    const response = approveToken({
      tokenContract: fakeContract,
      spenderAddress: fakeAddress,
    });

    expect(response).toStrictEqual({
      contract: fakeContract,
      args: [fakeAddress, 0],
      methodName: 'approve',
    });
  });
});
