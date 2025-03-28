import BigNumber from 'bignumber.js';
import type { PublicClient } from 'viem';

import fakeAddress from '__mocks__/models/address';
import { vrt } from '__mocks__/models/tokens';

import { getAllowance } from '..';

const fakeSpenderAddress = '0x000000000000000000000000000000000sPeNdEr';

describe('getAllowance', () => {
  test('returns the allowance on success', async () => {
    const fakeAllowanceMantissa = 10000n;

    const readContractMock = vi.fn(async () => fakeAllowanceMantissa);

    const fakePublicClient = {
      readContract: readContractMock,
    } as unknown as PublicClient;

    const response = await getAllowance({
      token: vrt,
      publicClient: fakePublicClient,
      spenderAddress: fakeSpenderAddress,
      accountAddress: fakeAddress,
    });

    expect(readContractMock).toHaveBeenCalledTimes(1);
    expect(readContractMock).toHaveBeenCalledWith({
      abi: expect.any(Object),
      address: vrt.address,
      functionName: 'allowance',
      args: [fakeAddress, fakeSpenderAddress],
    });
    expect(response.allowanceMantissa instanceof BigNumber).toBe(true);
    expect(response).toEqual({
      allowanceMantissa: new BigNumber(fakeAllowanceMantissa.toString()),
    });
  });
});
