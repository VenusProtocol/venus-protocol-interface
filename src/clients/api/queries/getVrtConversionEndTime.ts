import { VrtConverter } from 'types/contracts';

export interface IGetVrtConversionEndTimeInput {
  vrtConverterContract: VrtConverter;
}

export type GetVrtConversionEndTimeOutput = string;

const getVrtConverstionEndTime = ({
  vrtConverterContract,
}: IGetVrtConversionEndTimeInput): Promise<GetVrtConversionEndTimeOutput> =>
  vrtConverterContract.methods.conversionEndTime().call();

export default getVrtConverstionEndTime;
