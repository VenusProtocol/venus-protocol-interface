import fakeXvsVaultContractAddress from '__mocks__/models/address';
import { xvs } from '__mocks__/models/tokens';
import { xvsVaultAbi } from 'libs/contracts';
import type { PublicClient } from 'viem';

import { getXvsVaultTotalAllocationPoints } from '..';

describe('getXvsVaultTotalAllocationPoints', () => {
  test('returns the total allocation points on success', async () => {
    const fakeOutput = 100n;

    const readContractMock = vi.fn().mockResolvedValue(fakeOutput);

    const fakePublicClient = {
      readContract: readContractMock,
    } as unknown as PublicClient;

    const response = await getXvsVaultTotalAllocationPoints({
      publicClient: fakePublicClient,
      xvsVaultContractAddress: fakeXvsVaultContractAddress,
      tokenAddress: xvs.address,
    });

    expect(readContractMock).toHaveBeenCalledTimes(1);
    expect(readContractMock).toHaveBeenCalledWith({
      address: fakeXvsVaultContractAddress,
      abi: xvsVaultAbi,
      functionName: 'totalAllocPoints',
      args: [xvs.address],
    });
    expect(response).toEqual({
      totalAllocationPoints: Number(fakeOutput),
    });
  });
});
