import { VrtConverter } from 'types/contracts';
import getVrtConversionEndTime, { GetVrtConversionEndTimeOutput } from './getVrtConversionEndTime';

describe('api/queries/getVrtConversionEndTime', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        conversionEndTime: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as VrtConverter;

    try {
      await getVrtConversionEndTime({
        vrtConverterContract: fakeContract,
      });

      throw new Error('getVrtConversionEndTime should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns the conversion end time on success', async () => {
    const fakeOutput: GetVrtConversionEndTimeOutput = '365';

    const callMock = jest.fn(async () => fakeOutput);
    const vrtConversionEndtimeMock = jest.fn(() => ({
      call: callMock,
    }));

    const fakeContract = {
      methods: {
        conversionEndTime: vrtConversionEndtimeMock,
      },
    } as unknown as VrtConverter;

    const response = await getVrtConversionEndTime({
      vrtConverterContract: fakeContract,
    });

    expect(vrtConversionEndtimeMock).toHaveBeenCalledTimes(1);
    expect(callMock).toHaveBeenCalledTimes(1);
    expect(callMock).toHaveBeenCalledWith();
    expect(response).toBe(fakeOutput);
  });
});
