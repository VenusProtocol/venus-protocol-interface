import { ContractTypeByName } from 'packages/contracts';

export interface GetVTokenInterestRateModelInput {
  vTokenContract: ContractTypeByName<'vToken' | 'vBnb'>;
}

export type GetVTokenInterestRateModelOutput = {
  contractAddress: string;
};

const getVTokenInterestRateModel = async ({
  vTokenContract,
}: GetVTokenInterestRateModelInput): Promise<GetVTokenInterestRateModelOutput> => {
  const contractAddress = await vTokenContract.interestRateModel();

  return {
    contractAddress,
  };
};

export default getVTokenInterestRateModel;
