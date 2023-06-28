import { BigNumber as BN } from 'ethers';

import { VrtConverter } from 'types/contracts';

import getVrtConversionEndTime from '.';

describe('api/queries/getVrtConversionEndTime', () => {
  test('returns the conversion end time on success', async () => {
    const fakeOutput = BN.from(1678859525000);
    const vrtConversionEndtimeMock = vi.fn(async () => fakeOutput);

    const fakeContract = {
      conversionEndTime: vrtConversionEndtimeMock,
    } as unknown as VrtConverter;

    const response = await getVrtConversionEndTime({
      vrtConverterContract: fakeContract,
    });

    expect(vrtConversionEndtimeMock).toHaveBeenCalledTimes(1);
    expect(response).toEqual({
      conversionEndTime: new Date(fakeOutput.mul(1000).toNumber()),
    });
  });
});
