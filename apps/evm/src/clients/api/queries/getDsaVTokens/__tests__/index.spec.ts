import type { PublicClient } from 'viem';

import fakeAddress from '__mocks__/models/address';
import { relativePositionManagerAbi } from 'libs/contracts';
import { getDsaVTokens } from '..';

describe('getDsaVTokens', () => {
  test('returns DSA vToken addresses', async () => {
    const fakeDsaVTokenAddresses = [fakeAddress, '0x0000000000000000000000000000000000000001'];

    const readContractMock = vi.fn().mockResolvedValue(fakeDsaVTokenAddresses);

    const fakePublicClient = {
      readContract: readContractMock,
    } as unknown as PublicClient;

    const response = await getDsaVTokens({
      publicClient: fakePublicClient,
      relativePositionManagerAddress: fakeAddress,
    });

    expect(readContractMock).toHaveBeenCalledTimes(1);
    expect(readContractMock).toHaveBeenCalledWith({
      address: fakeAddress,
      abi: relativePositionManagerAbi,
      functionName: 'getDsaVTokens',
    });

    expect(response).toEqual({
      dsaVTokenAddresses: fakeDsaVTokenAddresses,
    });
  });
});
