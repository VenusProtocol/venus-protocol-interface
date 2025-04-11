import fakeXvsVaultContractAddress, {
  altAddress as fakeAccountAddress,
} from '__mocks__/models/address';
import { xvs } from '__mocks__/models/tokens';
import { xvsVaultAbi } from 'libs/contracts';
import type { PublicClient } from 'viem';

import { getXvsVaultUserPendingWithdrawalsFromBeforeUpgrade } from '..';

const fakePid = 0;
const fakeAmount = 1000n;

describe('getXvsVaultUserPendingWithdrawalsFromBeforeUpgrade', () => {
  test('returns total amount of pending withdrawals before the contract upgrade on success', async () => {
    const readContractMock = vi.fn().mockResolvedValue(fakeAmount);

    const fakePublicClient = {
      readContract: readContractMock,
    } as unknown as PublicClient;

    const response = await getXvsVaultUserPendingWithdrawalsFromBeforeUpgrade({
      publicClient: fakePublicClient,
      xvsVaultContractAddress: fakeXvsVaultContractAddress,
      rewardTokenAddress: xvs.address,
      poolIndex: fakePid,
      accountAddress: fakeAccountAddress,
    });

    expect(readContractMock).toHaveBeenCalledTimes(1);
    expect(readContractMock).toHaveBeenCalledWith({
      address: fakeXvsVaultContractAddress,
      abi: xvsVaultAbi,
      functionName: 'pendingWithdrawalsBeforeUpgrade',
      args: [xvs.address, BigInt(fakePid), fakeAccountAddress],
    });

    expect(response).toMatchSnapshot();
  });
});
