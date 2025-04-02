import BigNumber from 'bignumber.js';
import type { PublicClient } from 'viem';

import fakeAddress from '__mocks__/models/address';

import { getVTokenBalance } from '..';

describe('getVTokenBalance', () => {
  test('returns the balance on success', async () => {
    const fakeBalanceMantissa = 1000n;

    const readContractMock = vi.fn(async () => fakeBalanceMantissa);

    const fakePublicClient = {
      readContract: readContractMock,
    } as unknown as PublicClient;

    const response = await getVTokenBalance({
      publicClient: fakePublicClient,
      vTokenAddress: fakeAddress,
      accountAddress: fakeAddress,
    });

    expect(readContractMock).toHaveBeenCalledTimes(1);
    expect(readContractMock).toHaveBeenCalledWith({
      address: fakeAddress,
      abi: expect.any(Object),
      functionName: 'balanceOf',
      args: [fakeAddress],
    });
    expect(response).toEqual({
      balanceMantissa: new BigNumber(fakeBalanceMantissa.toString()),
    });
  });
});
