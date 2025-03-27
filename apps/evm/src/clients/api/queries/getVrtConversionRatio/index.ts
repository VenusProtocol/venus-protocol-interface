import BigNumber from 'bignumber.js';

import type { VrtConverter } from 'libs/contracts';

export interface VrtConversionRatioInput {
  vrtConverterContract: VrtConverter;
}

export type GetVrtConversionRatioOutput = {
  conversionRatio: BigNumber;
};

export const getVrtConversionRatio = async ({
  vrtConverterContract,
}: VrtConversionRatioInput): Promise<GetVrtConversionRatioOutput> => {
  const conversionRatio = await vrtConverterContract.conversionRatio();

  return { conversionRatio: new BigNumber(conversionRatio.toString()) };
};
