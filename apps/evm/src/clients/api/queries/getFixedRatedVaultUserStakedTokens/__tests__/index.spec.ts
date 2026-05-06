import BigNumber from 'bignumber.js';
import type { PublicClient } from 'viem';

import { getFixedRatedVaultUserStakedTokens } from '..';

const fakeAccountAddress = '0x3d759121234cd36F8124C21aFe1c6852d2bEd848' as const;
const fakeVaultAddresses = [
  '0x1111111111111111111111111111111111111111',
  '0x2222222222222222222222222222222222222222',
] as const;

describe('getFixedRatedVaultUserStakedTokens', () => {
  it('throws when accountAddress is missing', async () => {
    await expect(
      getFixedRatedVaultUserStakedTokens({
        accountAddress: '' as `0x${string}`,
        vaultAddresses: [...fakeVaultAddresses],
        publicClient: {} as PublicClient,
      }),
    ).rejects.toThrow();
  });

  it('returns multicall balance results', async () => {
    const mockPublicClient = {
      multicall: vi.fn().mockResolvedValue([
        { status: 'success', result: 500000000000000000n },
        { status: 'success', result: 1000000000000000000n },
      ]),
    } as unknown as PublicClient;

    const result = await getFixedRatedVaultUserStakedTokens({
      accountAddress: fakeAccountAddress,
      vaultAddresses: [...fakeVaultAddresses],
      publicClient: mockPublicClient,
    });

    expect(result).toEqual([
      {
        vaultAddress: fakeVaultAddresses[0],
        tokensMantissa: new BigNumber('500000000000000000'),
      },
      {
        vaultAddress: fakeVaultAddresses[1],
        tokensMantissa: new BigNumber('1000000000000000000'),
      },
    ]);
  });

  it('throws when one multicall balance read fails', async () => {
    const mockPublicClient = {
      multicall: vi.fn().mockResolvedValue([
        { status: 'success', result: 500000000000000000n },
        { status: 'failure', error: new Error('boom') },
      ]),
    } as unknown as PublicClient;

    await expect(
      getFixedRatedVaultUserStakedTokens({
        accountAddress: fakeAccountAddress,
        vaultAddresses: [...fakeVaultAddresses],
        publicClient: mockPublicClient,
      }),
    ).rejects.toThrow();
  });
});
