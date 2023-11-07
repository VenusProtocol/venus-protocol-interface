import { Prime } from 'packages/contracts';

import fakeContractTransaction from '__mocks__/models/contractTransaction';

import claimPrimeToken from '.';

describe('claimPrimeToken', () => {
  test('returns contract receipt when request succeeds', async () => {
    const claimPrimeTokenMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      claim: claimPrimeTokenMock,
    } as unknown as Prime;

    const response = await claimPrimeToken({
      primeContract: fakeContract,
    });

    expect(response).toBe(fakeContractTransaction);
    expect(claimPrimeTokenMock).toHaveBeenCalledTimes(1);
  });
});
