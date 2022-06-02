import { XvsVault } from 'types/contracts';
import getXvsVaultTotalAllocPoints from './getXvsVaultTotalAllocPoints';

const fakeTokenAddress = '0x0';

describe('api/queries/getXvsVaultTotalAllocPoints', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        totalAllocPoints: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as XvsVault;

    try {
      await getXvsVaultTotalAllocPoints({
        xvsVaultContract: fakeContract,
        tokenAddress: fakeTokenAddress,
      });

      throw new Error('getXvsVaultTotalAllocPoints should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns the total allocation points on success', async () => {
    const fakeOutput = '100';

    const callMock = jest.fn(async () => fakeOutput);
    const totalAllocPointsMock = jest.fn(() => ({
      call: callMock,
    }));

    const fakeContract = {
      methods: {
        totalAllocPoints: totalAllocPointsMock,
      },
    } as unknown as XvsVault;

    const response = await getXvsVaultTotalAllocPoints({
      xvsVaultContract: fakeContract,
      tokenAddress: fakeTokenAddress,
    });

    expect(callMock).toHaveBeenCalledTimes(1);
    expect(totalAllocPointsMock).toHaveBeenCalledTimes(1);
    expect(totalAllocPointsMock).toHaveBeenCalledWith(fakeTokenAddress);
    expect(response).toStrictEqual(+fakeOutput);
  });
});
