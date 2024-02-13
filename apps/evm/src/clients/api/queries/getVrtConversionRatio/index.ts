import BigNumber from 'bignumber.js';
import { VrtConverter } from 'libs/contracts';

export interface VrtConversionRatioInput {
  vrtConverterContract: VrtConverter;
}

export type GetVrtConversionRatioOutput = {
  conversionRatio: BigNumber;
};

const getVrtConversionRatio = async ({
  vrtConverterContract,
}: VrtConversionRatioInput): Promise<GetVrtConversionRatioOutput> => {
  const conversionRatio = await vrtConverterContract.conversionRatio();

  return { conversionRatio: new BigNumber(conversionRatio.toString()) };
};

export default getVrtConversionRatio;
