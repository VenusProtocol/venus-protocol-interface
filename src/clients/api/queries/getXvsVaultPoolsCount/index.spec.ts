import { TOKENS } from 'constants/tokens';
import { XvsVault } from 'types/contracts';

import getXvsVaultPoolsCount, { GetXvsVaultPoolsCountOutput } from '.';

const xvsTokenAddress = TOKENS.xvs.address;

describe('api/queries/getXvsVaultPoolCount', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        poolLength: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as XvsVault;

    try {
      await getXvsVaultPoolCount({
        xvsVaultContract: fakeContract,
      });

      throw new Error('getXvsVaultPoolCount should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns the XVS vault pool length on success', async () => {
    const fakeOutput = '10';

    const callMock = jest.fn(async () => fakeOutput);
    const poolLengthMock = jest.fn(() => ({
      call: callMock,
    }));

    const fakeContract = {
      methods: {
        poolLength: poolLengthMock,
      },
    } as unknown as XvsVault;

    const response = await getXvsVaultPoolCount({
      xvsVaultContract: fakeContract,
    });

    expect(callMock).toHaveBeenCalledTimes(1);
    expect(poolLengthMock).toHaveBeenCalledTimes(1);
    expect(poolLengthMock).toHaveBeenCalledWith(xvsTokenAddress);
    expect(response).toEqual({
      poolCount: +fakeOutput,
    });
  });
});
