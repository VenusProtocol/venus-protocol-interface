import { Prime } from 'libs/contracts';

import fakeAccountAddress from '__mocks__/models/address';

import getPrimeToken from '.';

vi.mock('libs/contracts');

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
