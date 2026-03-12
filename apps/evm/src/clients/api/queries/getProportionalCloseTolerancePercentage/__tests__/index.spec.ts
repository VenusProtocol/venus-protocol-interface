import type { PublicClient } from 'viem';

import fakeAddress from '__mocks__/models/address';
import { relativePositionManagerAbi } from 'libs/contracts';
import { getProportionalCloseTolerancePercentage } from '..';

describe('getProportionalCloseTolerancePercentage', () => {
  test('returns proportional close tolerance as percentage', async () => {
    const readContractMock = vi.fn().mockResolvedValue(250n);

    const fakePublicClient = {
      readContract: readContractMock,
    } as unknown as PublicClient;

    const response = await getProportionalCloseTolerancePercentage({
      publicClient: fakePublicClient,
      relativePositionManagerAddress: fakeAddress,
    });

    expect(readContractMock).toHaveBeenCalledTimes(1);
    expect(readContractMock).toHaveBeenCalledWith({
      address: fakeAddress,
      abi: relativePositionManagerAbi,
      functionName: 'proportionalCloseTolerance',
    });

    expect(response).toEqual({
      proportionalCloseTolerancePercentage: 0.025,
    });
  });
});
