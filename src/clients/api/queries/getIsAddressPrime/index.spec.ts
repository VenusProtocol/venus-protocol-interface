import { Prime } from 'packages/contracts';

import fakeAccountAddress from '__mocks__/models/address';

import getIsAddressPrime from '.';

vi.mock('packages/contracts');

describe('getIsAddressPrime', () => {
  it('returns Prime status of passed account', async () => {
    const fakePrimeContract = {
      tokens: vi.fn(() => ({
        exists: true,
      })),
    } as unknown as Prime;

    const response = await getIsAddressPrime({
      accountAddress: fakeAccountAddress,
      primeContract: fakePrimeContract,
    });

    expect(fakePrimeContract.tokens).toHaveBeenCalledTimes(1);
    expect(fakePrimeContract.tokens).toHaveBeenCalledWith(fakeAccountAddress);
    expect(response).toEqual({
      isPrime: true,
    });
  });
});
