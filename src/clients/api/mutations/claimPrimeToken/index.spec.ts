import { Prime } from 'packages/contracts';

import fakeContractReceipt from '__mocks__/models/contractReceipt';

import claimPrimeToken from '.';

describe('api/mutations/claimPrimeToken', () => {
  test('returns contract receipt when request succeeds', async () => {
    const waitMock = vi.fn(async () => fakeContractReceipt);
    const claimPrimeTokenMock = vi.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      claim: claimPrimeTokenMock,
    } as unknown as Prime;

    const response = await claimPrimeToken({
      primeContract: fakeContract,
    });

    expect(response).toBe(fakeContractReceipt);
    expect(claimPrimeTokenMock).toHaveBeenCalledTimes(1);
  });
});
