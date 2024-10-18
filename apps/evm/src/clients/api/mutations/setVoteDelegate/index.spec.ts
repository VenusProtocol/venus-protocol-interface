import fakeAddress from '__mocks__/models/address';
import fakeContractTransaction from '__mocks__/models/contractTransaction';

import type { XvsVault } from 'libs/contracts';

import setVoteDelegate from '.';

describe('setVoteDelegate', () => {
  test('returns contract transaction when request succeeds', async () => {
    const delegateMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      delegate: delegateMock,
    } as unknown as XvsVault;

    const response = setVoteDelegate({
      xvsVaultContract: fakeContract,
      delegateAddress: fakeAddress,
    });

    expect(response).toStrictEqual({
      contract: fakeContract,
      args: [fakeAddress],
      methodName: 'delegate',
    });
  });
});
