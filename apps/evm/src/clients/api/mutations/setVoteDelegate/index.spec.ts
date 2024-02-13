import { XvsVault } from 'libs/contracts';

import fakeAddress from '__mocks__/models/address';
import fakeContractTransaction from '__mocks__/models/contractTransaction';

import setVoteDelegate from '.';

describe('setVoteDelegate', () => {
  test('returns contract transaction when request succeeds', async () => {
    const delegateMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      delegate: delegateMock,
    } as unknown as XvsVault;

    const response = await setVoteDelegate({
      xvsVaultContract: fakeContract,
      delegateAddress: fakeAddress,
    });

    expect(response).toBe(fakeContractTransaction);
    expect(delegateMock).toHaveBeenCalledTimes(1);
    expect(delegateMock).toHaveBeenCalledWith(fakeAddress);
  });
});
