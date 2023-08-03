import { ContractTypeByName } from 'packages/contracts';

import { VBnbToken } from 'types/contracts';

export interface GetVTokenInterestRateModelInput {
  vTokenContract: ContractTypeByName<'vToken'> | VBnbToken;
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
