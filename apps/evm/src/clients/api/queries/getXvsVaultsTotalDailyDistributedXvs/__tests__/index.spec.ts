import fakeXvsVaultContractAddress from '__mocks__/models/address';
import { xvs } from '__mocks__/models/tokens';
import { xvsVaultAbi } from 'libs/contracts';
import type { PublicClient } from 'viem';

import { getXvsVaultsTotalDailyDistributedXvs } from '..';

const xvsTokenAddress = xvs.address;
const fakeOutput = 2000000000000000000n;

describe('getXvsVaultsTotalDailyDistributedXvs', () => {
  it('returns the correct daily distributed XVS', async () => {
    const readContractMock = vi.fn().mockResolvedValue(fakeOutput);

    const fakePublicClient = {
      readContract: readContractMock,
    } as unknown as PublicClient;

    const response = await getXvsVaultsTotalDailyDistributedXvs({
      publicClient: fakePublicClient,
      xvsVaultContractAddress: fakeXvsVaultContractAddress,
      stakedToken: xvs,
      blocksPerDay: 28800,
    });

    expect(readContractMock).toHaveBeenCalledTimes(1);
    expect(readContractMock).toHaveBeenCalledWith({
      address: fakeXvsVaultContractAddress,
      abi: xvsVaultAbi,
      functionName: 'rewardTokenAmountsPerBlockOrSecond',
      args: [xvsTokenAddress],
    });
    expect(response.dailyDistributedXvs).toMatchInlineSnapshot('"57600"');
  });
});
