import type { PublicClient } from 'viem';

import fakeAccountAddress from '__mocks__/models/address';

import { getIsUserPrime } from '..';

describe('getIsUserPrime', () => {
  it('returns the Prime holder status of the passed account', async () => {
    const fakePrimeV2ContractAddress = '0x0000000000000000000000000000000000000000' as const;

    // Mock the publicClient
    const fakePublicClient = {
      readContract: vi.fn(async () => true),
    } as unknown as PublicClient;

    const response = await getIsUserPrime({
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

    expect(response).toEqual({ isPrime: true });
  });
});
