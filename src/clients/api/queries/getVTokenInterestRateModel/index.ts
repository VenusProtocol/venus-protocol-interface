import { VBnb, VToken as VTokenContract } from 'packages/contracts';

export interface GetVTokenInterestRateModelInput {
  vTokenContract: VTokenContract | VBnb;
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
