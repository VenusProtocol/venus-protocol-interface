import { VrtToken } from 'types/contracts';
import getAllowance, { GetAllowanceOutput } from './getAllowance';

const fakeAccountAddress = '0x000000000000000000000000000000000AcCoUnt';
const fakeSpenderAddress = '0x000000000000000000000000000000000sPeNdEr';

describe('api/queries/getAllowance', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        allowance: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as VrtToken;

    try {
      await getAllowance({
        tokenContract: fakeContract,
        accountAddress: fakeAccountAddress,
        spenderAddress: fakeSpenderAddress,
      });

      throw new Error('getAllowance should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns the Allowance on success', async () => {
    const fakeOutput: GetAllowanceOutput = '0';

    const callMock = jest.fn(async () => fakeOutput);
    const vrtAllowanceMock = jest.fn(() => ({
      call: callMock,
    }));

    const fakeContract = {
      methods: {
        allowance: vrtAllowanceMock,
      },
    } as unknown as VrtToken;

    const response = await getAllowance({
      tokenContract: fakeContract,
      accountAddress: fakeAccountAddress,
      spenderAddress: fakeSpenderAddress,
    });

    expect(vrtAllowanceMock).toHaveBeenCalledTimes(1);
    expect(callMock).toHaveBeenCalledTimes(1);
    expect(vrtAllowanceMock).toHaveBeenCalledWith(fakeAccountAddress, fakeSpenderAddress);
    expect(response).toBe(fakeOutput);
  });
});
