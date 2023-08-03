import { ContractTypeByName } from 'packages/contracts';

export interface GetVrtConversionEndTimeInput {
  vrtConverterContract: ContractTypeByName<'vrtConverter'>;
}

export type GetVrtConversionEndTimeOutput = {
  conversionEndTime: Date;
};

const getVrtConverstionEndTime = async ({
  vrtConverterContract,
}: GetVrtConversionEndTimeInput): Promise<GetVrtConversionEndTimeOutput> => {
  const resp = await vrtConverterContract.conversionEndTime();

  // End Date is returned as unix timestamp;
  return {
    conversionEndTime: new Date(resp.mul(1000).toNumber()),
  };
};

export default getVrtConverstionEndTime;
