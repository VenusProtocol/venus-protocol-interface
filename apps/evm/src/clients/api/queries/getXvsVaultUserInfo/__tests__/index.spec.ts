import fakeContractAddress, { altAddress as fakeAccountAddress } from '__mocks__/models/address';
import { xvs } from '__mocks__/models/tokens';
import { xvsVaultAbi } from 'libs/contracts';
import type { PublicClient } from 'viem';

import { getXvsVaultUserInfo } from '..';

const fakePid = 1;

describe('getXvsVaultUserInfo', () => {
  test('returns user info related to XVS vault in correct format on success', async () => {
    const readContractMock = vi.fn().mockResolvedValue([
      30000000000000000000n, // amount
      1000000000000000000n, // pendingWithdrawals
      2000000000000000000n, // rewardDebt
    ]);

    const fakePublicClient = {
      readContract: readContractMock,
    } as unknown as PublicClient;

    const response = await getXvsVaultUserInfo({
      publicClient: fakePublicClient,
      xvsVaultContractAddress: fakeContractAddress,
      rewardTokenAddress: xvs.address,
      accountAddress: fakeAccountAddress,
      poolIndex: fakePid,
    });

    expect(readContractMock).toHaveBeenCalledTimes(1);
    expect(readContractMock).toHaveBeenCalledWith({
      address: fakeContractAddress,
      abi: xvsVaultAbi,
      functionName: 'getUserInfo',
      args: [xvs.address, BigInt(fakePid), fakeAccountAddress],
    });

    expect(response).toMatchSnapshot();
  });
});
