import { VrtConverter } from 'types/contracts';

export interface VrtConversionRatioInput {
  vrtConverterContract: VrtConverter;
}

export type GetVrtConversionRatioOutput = {
  conversionRatio: string;
};

const getVrtConversionRatio = async ({
  vrtConverterContract,
}: VrtConversionRatioInput): Promise<GetVrtConversionRatioOutput> => {
  const conversionRatio = await vrtConverterContract.methods.conversionRatio().call();

  return { conversionRatio };
};

export default getVrtConversionRatio;
