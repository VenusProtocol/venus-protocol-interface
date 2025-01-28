import type { PublicClient } from 'viem';

import fakeAccountAddress, {
  altAddress as fakeVaiControllerContractAddress,
} from '__mocks__/models/address';

import { getUserVaiBorrowBalance } from '..';

const fakeVaiRepayAmountWithInterests = 10000000000n;

describe('getUserVaiBorrowBalance', () => {
  it('throws an error when the multicall fails', async () => {
    const multicallMock = vi.fn(() => [
      undefined,
      {
        result: undefined,
        status: 'failure',
      },
    ]);

    const fakePublicClient = {
      multicall: multicallMock,
    } as unknown as PublicClient;

    try {
      await getUserVaiBorrowBalance({
        accountAddress: fakeAccountAddress,
        publicClient: fakePublicClient,
        vaiControllerContractAddress: fakeVaiControllerContractAddress,
      });

      throw new Error('getUserVaiBorrowBalance should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: somethingWentWrong]');
    }
  });

  it('returns the VAI fee with interests', async () => {
    const multicallMock = vi.fn(() => [
      undefined,
      {
        result: fakeVaiRepayAmountWithInterests,
        status: 'success',
      },
    ]);

    const fakePublicClient = {
      multicall: multicallMock,
    } as unknown as PublicClient;

    const response = await getUserVaiBorrowBalance({
      accountAddress: fakeAccountAddress,
      publicClient: fakePublicClient,
      vaiControllerContractAddress: fakeVaiControllerContractAddress,
    });

    expect(multicallMock).toHaveBeenCalledTimes(1);
    expect(multicallMock).toHaveBeenCalledWith({
      contracts: [
        {
          abi: expect.any(Object),
          address: fakeVaiControllerContractAddress,
          functionName: 'accrueVAIInterest',
        },
        {
          abi: expect.any(Object),
          address: fakeVaiControllerContractAddress,
          functionName: 'getVAIRepayAmount',
          args: [fakeAccountAddress],
        },
      ],
    });

    expect(response).toMatchSnapshot();
  });
});
