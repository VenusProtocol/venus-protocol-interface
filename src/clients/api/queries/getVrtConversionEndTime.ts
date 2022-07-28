import { VrtConverter } from 'types/contracts';

export interface GetVrtConversionEndTimeInput {
  vrtConverterContract: VrtConverter;
}

export type GetVrtConversionEndTimeOutput = Date;

const getVrtConverstionEndTime = async ({
  vrtConverterContract,
}: GetVrtConversionEndTimeInput): Promise<GetVrtConversionEndTimeOutput> => {
  const resp = await vrtConverterContract.methods.conversionEndTime().call();
  // End Date is returned as unix timestamp;
  return new Date(+resp * 1000);
};

export default getVrtConverstionEndTime;
