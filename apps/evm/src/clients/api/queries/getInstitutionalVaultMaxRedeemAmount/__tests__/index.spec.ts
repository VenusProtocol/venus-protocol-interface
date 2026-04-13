import BigNumber from 'bignumber.js';
import type { PublicClient } from 'viem';
import { getInstitutionalVaultMaxRedeemAmount } from '..';

const fakeAccountAddress = '0x3d759121234cd36F8124C21aFe1c6852d2bEd848' as const;
const fakeVaultAddress = '0x1111111111111111111111111111111111111111' as const;

describe('getInstitutionalVaultMaxRedeemAmount', () => {
  it('returns the reward amount from maxRedeem', async () => {
    const mockPublicClient = {
      readContract: vi.fn().mockResolvedValue(500000000000000000n),
    } as unknown as PublicClient;

    const result = await getInstitutionalVaultMaxRedeemAmount({
      accountAddress: fakeAccountAddress,
      vaultAddress: fakeVaultAddress,
      publicClient: mockPublicClient,
    });

    expect(result).toEqual({
      amountMantissa: new BigNumber('500000000000000000'),
    });

    expect(mockPublicClient.readContract).toHaveBeenCalledWith({
      abi: expect.any(Array),
      address: fakeVaultAddress,
      functionName: 'maxRedeem',
      args: [fakeAccountAddress],
    });
  });
});
