import type { PublicClient } from 'viem';

import fakeAccountAddress from '__mocks__/models/address';

import getPrimeToken from '..';

describe('getPrimeToken', () => {
  it('returns Prime status of passed account', async () => {
    const fakePrimeContractAddress = '0x0000000000000000000000000000000000000000' as const;
    
    // Mock the publicClient
    const fakePublicClient = {
      readContract: vi.fn(async () => [true, true]), // [exists, isIrrevocable]
    } as unknown as PublicClient;

    const response = await getPrimeToken({
      accountAddress: fakeAccountAddress,
      primeContractAddress: fakePrimeContractAddress,
      publicClient: fakePublicClient,
    });

    expect(fakePublicClient.readContract).toHaveBeenCalledTimes(1);
    expect(fakePublicClient.readContract).toHaveBeenCalledWith({
      address: fakePrimeContractAddress,
      abi: expect.any(Array),
      functionName: 'tokens',
      args: [fakeAccountAddress],
    });
    
    expect(response).toEqual({
      exists: true,
      isIrrevocable: true,
    });
  });
});
