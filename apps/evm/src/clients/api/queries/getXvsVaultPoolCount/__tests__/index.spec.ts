import fakeXvsVaultContractAddress, {
  altAddress as fakeXvsTokenAddress,
} from '__mocks__/models/address';
import { xvsVaultAbi } from 'libs/contracts';
import type { PublicClient } from 'viem';

import { getXvsVaultPoolCount } from '..';

describe('getXvsVaultPoolCount', () => {
  test('returns the pool count successfully', async () => {
    // Create a mock response for the poolLength function
    const poolLengthMock = 5n;

    const readContractMock = vi.fn().mockResolvedValue(poolLengthMock);

    const fakePublicClient = {
      readContract: readContractMock,
    } as unknown as PublicClient;

    const response = await getXvsVaultPoolCount({
      xvsTokenAddress: fakeXvsTokenAddress,
      xvsVaultContractAddress: fakeXvsVaultContractAddress,
      publicClient: fakePublicClient,
    });

    expect(readContractMock).toHaveBeenCalledTimes(1);
    expect(readContractMock).toHaveBeenCalledWith({
      address: fakeXvsVaultContractAddress,
      abi: xvsVaultAbi,
      functionName: 'poolLength',
      args: [fakeXvsTokenAddress],
    });

    expect(response).toEqual({
      poolCount: 5,
    });
  });
});
