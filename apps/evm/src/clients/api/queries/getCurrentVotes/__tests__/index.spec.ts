import BigNumber from 'bignumber.js';
import type { PublicClient } from 'viem';

import getCurrentVotes from '..';

const fakeAccountAddress = '0x000000000000000000000000000000000AcCoUnt';

describe('getCurrentVotes', () => {
  test('returns current votes on success', async () => {
    const fakeOutput = 10000n;
    const fakeXvsVaultContractAddress = '0x00000000000000000000000000000000XVsVault';

    const readContractMock = vi.fn(async () => fakeOutput);

    const fakePublicClient = {
      readContract: readContractMock,
    } as unknown as PublicClient;

    const response = await getCurrentVotes({
      xvsVaultContractAddress: fakeXvsVaultContractAddress,
      publicClient: fakePublicClient,
      accountAddress: fakeAccountAddress,
    });

    expect(readContractMock).toHaveBeenCalledTimes(1);
    expect(readContractMock).toHaveBeenCalledWith({
      abi: expect.any(Object),
      address: fakeXvsVaultContractAddress,
      functionName: 'getCurrentVotes',
      args: [fakeAccountAddress],
    });
    expect(response).toEqual({
      votesMantissa: new BigNumber(fakeOutput.toString()),
    });
  });
});
