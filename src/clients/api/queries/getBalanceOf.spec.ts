import { VrtToken } from 'types/contracts';
import getBalanceOf, { GetBalanceOfOutput } from './getBalanceOf';

const fakeAccountAddress = '0x000000000000000000000000000000000AcCoUnt';

describe('api/queries/getBalanceOf', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        balanceOf: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as VrtToken;

    try {
      await getBalanceOf({
        tokenContract: fakeContract,
        accountAddress: fakeAccountAddress,
      });

      throw new Error('getVrtBalanceOf should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns the Allowance on success', async () => {
    const fakeOutput: GetBalanceOfOutput = '0';

    const callMock = jest.fn(async () => fakeOutput);
    const vrtBalanceOfMock = jest.fn(() => ({
      call: callMock,
    }));

    const fakeContract = {
      methods: {
        balanceOf: vrtBalanceOfMock,
      },
    } as unknown as VrtToken;

    const response = await getBalanceOf({
      tokenContract: fakeContract,
      accountAddress: fakeAccountAddress,
    });

    expect(vrtBalanceOfMock).toHaveBeenCalledTimes(1);
    expect(callMock).toHaveBeenCalledTimes(1);
    expect(vrtBalanceOfMock).toHaveBeenCalledWith(fakeAccountAddress);
    expect(response).toBe(fakeOutput);
  });
});
