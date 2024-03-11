import BigNumber from 'bignumber.js';
import { BigNumber as BN } from 'ethers';

import type { VrtConverter } from 'libs/contracts';

import getVrtConversionRatio from '.';

describe('api/queries/getVrtConversionRatio', () => {
  test('returns the conversion ratio on success', async () => {
    const fakeOutput = BN.from('100000000000000000000000');

    const vrtConversionRatioMock = vi.fn(async () => fakeOutput);

    const fakeContract = {
      conversionRatio: vrtConversionRatioMock,
    } as unknown as VrtConverter;

    const response = await getVrtConversionRatio({
      vrtConverterContract: fakeContract,
    });

    expect(vrtConversionRatioMock).toHaveBeenCalledTimes(1);
    expect(response).toEqual({
      conversionRatio: new BigNumber(fakeOutput.toString()),
    });
  });
});
