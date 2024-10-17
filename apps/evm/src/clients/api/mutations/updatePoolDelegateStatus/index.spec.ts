import fakeContractTransaction from '__mocks__/models/contractTransaction';
import fakeSigner from '__mocks__/models/signer';

import type { IsolatedPoolComptroller } from 'libs/contracts';

import updatePoolDelegateStatus from '.';

describe('updatePoolDelegateStatus', () => {
  test('returns contract transaction when request succeeds', async () => {
    const fakeDelegateAddress = '0x1112223330000aaaaabbbbbaabbb654321888999';
    const updateDelegateMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      functions: {
        updateDelegate: updateDelegateMock,
      },
      signer: fakeSigner,
    } as unknown as IsolatedPoolComptroller;

    const response = await updatePoolDelegateStatus({
      poolComptrollerContract: fakeContract,
      approvedStatus: true,
      delegateeAddress: fakeDelegateAddress,
    });

    expect(response).toBe(fakeContractTransaction);
    expect(updateDelegateMock).toHaveBeenCalledTimes(1);
    expect(updateDelegateMock).toHaveBeenCalledWith(fakeDelegateAddress, true, {});
  });
});
