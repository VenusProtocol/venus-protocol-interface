import { VrtConverter } from 'types/contracts';

export interface VrtConversionRatioInput {
  vrtConverterContract: VrtConverter;
}

export type GetVrtConversionRatioOutput = string;

const getVrtConversionRatio = ({
  vrtConverterContract,
}: VrtConversionRatioInput): Promise<GetVrtConversionRatioOutput> =>
  vrtConverterContract.methods.conversionRatio().call();

export default getVrtConversionRatio;
