import type { PublicClient } from 'viem';

import fakeAccountAddress from '__mocks__/models/address';

import { getIsUserPrimeV2 } from '..';

describe('getIsUserPrimeV2', () => {
  it('returns PrimeV2 holder status of passed account', async () => {
    const fakePrimeV2ContractAddress = '0x0000000000000000000000000000000000000000' as const;

    const fakePublicClient = {
      readContract: vi.fn(async () => true),
    } as unknown as PublicClient;

    const response = await getIsUserPrimeV2({
      accountAddress: fakeAccountAddress,
      primeV2ContractAddress: fakePrimeV2ContractAddress,
      publicClient: fakePublicClient,
    });

    expect(fakePublicClient.readContract).toHaveBeenCalledTimes(1);
    expect(fakePublicClient.readContract).toHaveBeenCalledWith({
      address: fakePrimeV2ContractAddress,
      abi: expect.any(Array),
      functionName: 'isPrimeHolder',
      args: [fakeAccountAddress],
    });

    expect(response).toEqual({
      isPrimeHolder: true,
    });
  });
});
