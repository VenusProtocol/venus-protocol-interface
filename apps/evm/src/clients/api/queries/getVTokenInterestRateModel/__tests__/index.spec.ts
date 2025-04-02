import type { PublicClient } from 'viem';

import { getVTokenInterestRateModel } from '..';

describe('getVTokenInterestRateModel', () => {
  it('returns the interest rate model address for a vBep20 token', async () => {
    const mockReadContract = vi.fn(() => expectedContractAddress);
    const fakePublicClient = {
      readContract: mockReadContract,
    } as unknown as PublicClient;

    const expectedContractAddress = '0x1234567890123456789012345678901234567890';

    const response = await getVTokenInterestRateModel({
      publicClient: fakePublicClient,
      vTokenAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    });

    expect(response).toEqual({ contractAddress: expectedContractAddress });
    expect(mockReadContract).toHaveBeenCalledWith({
      address: '0xabcdef1234567890abcdef1234567890abcdef12',
      abi: expect.any(Array),
      functionName: 'interestRateModel',
    });
  });
});
