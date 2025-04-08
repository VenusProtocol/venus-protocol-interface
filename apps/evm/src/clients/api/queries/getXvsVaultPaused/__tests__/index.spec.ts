import { xvsVaultAbi } from 'libs/contracts';
import type { PublicClient } from 'viem';

import { getXvsVaultPaused } from '..';

const fakeXvsVaultContractAddress = '0x1234567890123456789012345678901234567890';

describe('getXvsVaultPaused', () => {
  test('returns whether the vault is paused, on success', async () => {
    const readContractMock = vi.fn().mockResolvedValue(true);

    const fakePublicClient = {
      readContract: readContractMock,
    } as unknown as PublicClient;

    const response = await getXvsVaultPaused({
      publicClient: fakePublicClient,
      xvsVaultContractAddress: fakeXvsVaultContractAddress,
    });

    expect(readContractMock).toHaveBeenCalledTimes(1);
    expect(readContractMock).toHaveBeenCalledWith({
      address: fakeXvsVaultContractAddress,
      abi: xvsVaultAbi,
      functionName: 'vaultPaused',
    });
    
    expect(response).toMatchSnapshot();
  });
});
