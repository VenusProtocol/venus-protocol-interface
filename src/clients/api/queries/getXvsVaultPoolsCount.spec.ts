import { XvsVault } from 'types/contracts';
import { TOKENS } from 'constants/tokens';
import getXvsVaultPoolsCount, { GetXvsVaultPoolsCountOutput } from './getXvsVaultPoolsCount';

const xvsTokenAddress = TOKENS.xvs.address;

describe('api/queries/getXvsVaultPoolsCount', () => {
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
      await getXvsVaultPoolsCount({
        xvsVaultContract: fakeContract,
      });

      throw new Error('getXvsVaultPoolsCount should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns the XVS vault pool length on success', async () => {
    const fakeOutput: GetXvsVaultPoolsCountOutput = 10;

    const callMock = jest.fn(async () => fakeOutput);
    const poolLengthMock = jest.fn(() => ({
      call: callMock,
    }));

    const fakeContract = {
      methods: {
        poolLength: poolLengthMock,
      },
    } as unknown as XvsVault;

    const response = await getXvsVaultPoolsCount({
      xvsVaultContract: fakeContract,
    });

    expect(callMock).toHaveBeenCalledTimes(1);
    expect(poolLengthMock).toHaveBeenCalledTimes(1);
    expect(poolLengthMock).toHaveBeenCalledWith(xvsTokenAddress);
    expect(response).toStrictEqual(fakeOutput);
  });
});
