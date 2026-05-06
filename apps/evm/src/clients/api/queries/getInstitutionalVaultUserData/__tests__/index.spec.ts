import BigNumber from 'bignumber.js';
import type { PublicClient } from 'viem';

import { getInstitutionalVaultUserData } from '..';

const fakeAccountAddress = '0x3d759121234cd36F8124C21aFe1c6852d2bEd848' as const;
const fakeVaultAddresses = [
  '0x1111111111111111111111111111111111111111',
  '0x2222222222222222222222222222222222222222',
] as const;

describe('getInstitutionalVaultUserData', () => {
  it('throws when accountAddress is missing', async () => {
    await expect(
      getInstitutionalVaultUserData({
        accountAddress: '' as `0x${string}`,
        vaultAddresses: [...fakeVaultAddresses],
        publicClient: {} as PublicClient,
      }),
    ).rejects.toThrow();
  });

  it('returns multicall user data', async () => {
    const mockPublicClient = {
      multicall: vi.fn().mockResolvedValue([
        { status: 'success', result: 500000000000000000n },
        { status: 'success', result: 250000000000000000n },
        { status: 'success', result: 300000000000000000n },
        { status: 'success', result: 1000000000000000000n },
        { status: 'success', result: 750000000000000000n },
        { status: 'success', result: 900000000000000000n },
      ]),
    } as unknown as PublicClient;

    const result = await getInstitutionalVaultUserData({
      accountAddress: fakeAccountAddress,
      vaultAddresses: [...fakeVaultAddresses],
      publicClient: mockPublicClient,
    });

    expect(result).toEqual([
      {
        vaultAddress: fakeVaultAddresses[0],
        tokensMantissa: new BigNumber('500000000000000000'),
        maxRedeemAmountMantissa: new BigNumber('250000000000000000'),
        maxWithdrawAmountMantissa: new BigNumber('300000000000000000'),
      },
      {
        vaultAddress: fakeVaultAddresses[1],
        tokensMantissa: new BigNumber('1000000000000000000'),
        maxRedeemAmountMantissa: new BigNumber('750000000000000000'),
        maxWithdrawAmountMantissa: new BigNumber('900000000000000000'),
      },
    ]);
  });

  it('throws when one multicall read fails', async () => {
    const mockPublicClient = {
      multicall: vi.fn().mockResolvedValue([
        { status: 'success', result: 500000000000000000n },
        { status: 'success', result: 250000000000000000n },
        { status: 'success', result: 300000000000000000n },
        { status: 'success', result: 1000000000000000000n },
        { status: 'failure', error: new Error('boom') },
        { status: 'success', result: 900000000000000000n },
      ]),
    } as unknown as PublicClient;

    await expect(
      getInstitutionalVaultUserData({
        accountAddress: fakeAccountAddress,
        vaultAddresses: [...fakeVaultAddresses],
        publicClient: mockPublicClient,
      }),
    ).rejects.toThrow();
  });
});
