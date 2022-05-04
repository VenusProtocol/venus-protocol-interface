import { VrtConverter } from 'types/contracts';
import getVrtConversionRatio, { GetVrtConversionRatioOutput } from './getVrtConversionRatio';

describe('api/queries/getVrtConversionRatio', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        conversionRatio: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as VrtConverter;

    try {
      await getVrtConversionRatio({
        vrtConverterContract: fakeContract,
      });

      throw new Error('getVrtConversionRatio should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns the conversion end time on success', async () => {
    const fakeOutput: GetVrtConversionRatioOutput = '0.5';

    const callMock = jest.fn(async () => fakeOutput);
    const vrtConversionRatioMock = jest.fn(() => ({
      call: callMock,
    }));

    const fakeContract = {
      methods: {
        conversionRatio: vrtConversionRatioMock,
      },
    } as unknown as VrtConverter;

    const response = await getVrtConversionRatio({
      vrtConverterContract: fakeContract,
    });

    expect(vrtConversionRatioMock).toHaveBeenCalledTimes(1);
    expect(callMock).toHaveBeenCalledTimes(1);
    expect(callMock).toHaveBeenCalledWith();
    expect(response).toBe(fakeOutput);
  });
});
