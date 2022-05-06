import { VrtConverter } from 'types/contracts';

export interface IGetVrtConversionEndTimeInput {
  vrtConverterContract: VrtConverter;
}

export type GetVrtConversionEndTimeOutput = Date;

const getVrtConverstionEndTime = async ({
  vrtConverterContract,
}: IGetVrtConversionEndTimeInput): Promise<GetVrtConversionEndTimeOutput> => {
  const resp = await vrtConverterContract.methods.conversionEndTime().call();
  return new Date(+resp * 1000);
};

export default getVrtConverstionEndTime;
