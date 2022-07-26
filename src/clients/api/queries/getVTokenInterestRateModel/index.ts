import { VBep20, VBnbToken } from 'types/contracts';

export interface GetVTokenInterestRateModelInput {
  vTokenContract: VBep20 | VBnbToken;
}

export type GetVTokenInterestRateModelOutput = {
  contractAddress: string;
};

const getVTokenInterestRateModel = async ({
  vTokenContract,
}: GetVTokenInterestRateModelInput): Promise<GetVTokenInterestRateModelOutput> => {
  const contractAddress = await vTokenContract.methods.interestRateModel().call();

  return {
    contractAddress,
  };
};

export default getVTokenInterestRateModel;
