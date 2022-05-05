import { VrtConverter } from 'types/contracts';

export interface IvrtConversionRatioInput {
  vrtConverterContract: VrtConverter;
}

export type GetVrtConversionRatioOutput = string;

const getVrtConversionRatio = ({
  vrtConverterContract,
}: IvrtConversionRatioInput): Promise<GetVrtConversionRatioOutput> =>
  vrtConverterContract.methods.conversionRatio().call();

export default getVrtConversionRatio;
