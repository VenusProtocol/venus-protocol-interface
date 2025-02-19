import type { Address, PublicClient } from 'viem';

import fakeAccountAddress from '__mocks__/models/address';

import { getMintableVai } from '..';

const fakeVaiAddress: Address = '0xfakeVaiAddress';
const fakeVaiControllerContractAddress: Address = '0xfakeVaiControllerContractAddress';

describe('getMintableVai', () => {
  test('returns the mintable VAI amount on success', async () => {
    const fakeMintCapMantissa = 1000000000000000n;
    const fakeTotalSupplyMantissa = 100000000000000n;
    const fakeMintableVaiMantissa = 100000000000000n;

    const multicallMock = vi.fn(() => [
      {
        result: fakeMintCapMantissa,
        status: 'success',
      },
      {
        result: fakeTotalSupplyMantissa,
        status: 'success',
      },
      {
        result: [undefined, fakeMintableVaiMantissa],
        status: 'success',
      },
    ]);

    const fakePublicClient = {
      multicall: multicallMock,
    } as unknown as PublicClient;

    const response = await getMintableVai({
      publicClient: fakePublicClient,
      vaiAddress: fakeVaiAddress,
      vaiControllerContractAddress: fakeVaiControllerContractAddress,
      accountAddress: fakeAccountAddress,
    });

    expect(multicallMock).toHaveBeenCalledTimes(1);
    expect(multicallMock).toHaveBeenCalledWith({
      contracts: [
        {
          abi: expect.any(Object),
          address: fakeVaiControllerContractAddress,
          functionName: 'mintCap',
        },
        {
          abi: expect.any(Object),
          address: fakeVaiAddress,
          functionName: 'totalSupply',
        },
        {
          abi: expect.any(Object),
          address: fakeVaiControllerContractAddress,
          functionName: 'getMintableVAI',
          args: [fakeAccountAddress],
        },
      ],
    });

    expect(response).toMatchSnapshot();
  });
});
