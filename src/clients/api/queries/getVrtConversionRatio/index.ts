import BigNumber from 'bignumber.js';
import { ContractTypeByName } from 'packages/contracts';

export interface VrtConversionRatioInput {
  vrtConverterContract: ContractTypeByName<'vrtConverter'>;
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
