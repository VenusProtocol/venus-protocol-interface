import fakeAccountAddress from '__mocks__/models/address';

import { Prime } from 'packages/contracts';

import getPrimeToken from '.';

vi.mock('packages/contracts');

describe('getPrimeToken', () => {
  it('returns Prime status of passed account', async () => {
    const fakePrimeContract = {
      tokens: vi.fn(() => ({
        exists: true,
        isIrrevocable: true,
      })),
    } as unknown as Prime;

    const response = await getPrimeToken({
      accountAddress: fakeAccountAddress,
      primeContract: fakePrimeContract,
    });

    expect(fakePrimeContract.tokens).toHaveBeenCalledTimes(1);
    expect(fakePrimeContract.tokens).toHaveBeenCalledWith(fakeAccountAddress);
    expect(response).toEqual({
      exists: true,
      isIrrevocable: true,
    });
  });
});
