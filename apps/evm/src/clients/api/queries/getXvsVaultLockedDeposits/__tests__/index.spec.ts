import fakeAccountAddress from '__mocks__/models/address';
import { xvs } from '__mocks__/models/tokens';
import { xvsVaultAbi } from 'libs/contracts';
import type { PublicClient } from 'viem';
import { getXvsVaultLockedDeposits } from '..';

const xvsTokenAddress = xvs.address;
const fakePid = 1;
const fakeXvsVaultContractAddress = '0x1234567890123456789012345678901234567890';

describe('getXvsVaultLockedDeposits', () => {
  test('returns withdrawal requests on success', async () => {
    const readContractMock = vi.fn().mockResolvedValue([
      {
        amount: 1000000000000000000n,
        lockedUntil: 1656499404n,
        afterUpgrade: 1000000000000000000n,
      },
      {
        amount: 2000000000000000000n,
        lockedUntil: 1656599404n,
        afterUpgrade: 1000000000000000000n,
      },
      {
        amount: 3000000000000000000n,
        lockedUntil: 1656699404n,
        afterUpgrade: 1000000000000000000n,
      },
    ]);

    const fakePublicClient = {
      readContract: readContractMock,
    } as unknown as PublicClient;

    const response = await getXvsVaultLockedDeposits({
      publicClient: fakePublicClient,
      xvsVaultContractAddress: fakeXvsVaultContractAddress,
      rewardTokenAddress: xvsTokenAddress,
      accountAddress: fakeAccountAddress,
      poolIndex: fakePid,
    });

    expect(readContractMock).toHaveBeenCalledTimes(1);
    expect(readContractMock).toHaveBeenCalledWith({
      address: fakeXvsVaultContractAddress,
      abi: xvsVaultAbi,
      functionName: 'getWithdrawalRequests',
      args: [xvsTokenAddress, BigInt(fakePid), fakeAccountAddress],
    });

    expect(response).toMatchSnapshot();
  });
});
