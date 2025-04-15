import fakeContractAddress, { altAddress as fakeTokenAddress } from '__mocks__/models/address';
import { xvsVaultAbi } from 'libs/contracts';
import type { PublicClient } from 'viem';

import { getXvsVaultPoolInfo } from '..';

describe('getXvsVaultPoolInfo', () => {
  test('returns the pool info successfully', async () => {
    const mockPoolInfo = [
      fakeTokenAddress, // token address
      5n, // allocPoint
      100000n, // lastRewardBlockOrSecond
      123456789n, // accRewardPerShare
      200n, // lockPeriod in seconds
    ] as const;

    const readContractMock = vi.fn().mockResolvedValue(mockPoolInfo);

    const fakePublicClient = {
      readContract: readContractMock,
    } as unknown as PublicClient;

    const poolIndex = 1;

    const response = await getXvsVaultPoolInfo({
      publicClient: fakePublicClient,
      xvsVaultContractAddress: fakeContractAddress,
      rewardTokenAddress: fakeTokenAddress,
      poolIndex,
    });

    expect(readContractMock).toHaveBeenCalledTimes(1);
    expect(readContractMock).toHaveBeenCalledWith({
      address: fakeContractAddress,
      abi: xvsVaultAbi,
      functionName: 'poolInfos',
      args: [fakeTokenAddress, BigInt(poolIndex)],
    });

    expect(response).toMatchSnapshot();
  });
});
