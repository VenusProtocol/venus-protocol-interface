import fakeContractAddress, { altAddress as fakeAccountAddress } from '__mocks__/models/address';
import { xvsVestingAbi } from 'libs/contracts';
import type { PublicClient } from 'viem';

import { getXvsWithdrawableAmount } from '..';

describe('getXvsWithdrawableAmount', () => {
  test('returns the withdrawable amount on success', async () => {
    const readContractMock = vi.fn().mockResolvedValue([
      1000000000000000000n, // totalWithdrawableAmount
      2000000000000000000n, // totalVestedAmount
      3000000000000000000n, // totalWithdrawnAmount
    ]);

    const fakePublicClient = {
      readContract: readContractMock,
    } as unknown as PublicClient;

    const response = await getXvsWithdrawableAmount({
      publicClient: fakePublicClient,
      xvsVestingContractAddress: fakeContractAddress,
      accountAddress: fakeAccountAddress,
    });

    expect(readContractMock).toHaveBeenCalledTimes(1);
    expect(readContractMock).toHaveBeenCalledWith({
      address: fakeContractAddress,
      abi: xvsVestingAbi,
      functionName: 'getWithdrawableAmount',
      args: [fakeAccountAddress],
    });

    expect(response).toMatchSnapshot();
  });
});
