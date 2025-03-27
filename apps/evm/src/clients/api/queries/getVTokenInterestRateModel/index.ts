import type { VBep20, VBnb } from 'libs/contracts';

export interface GetVTokenInterestRateModelInput {
  vTokenContract: VBep20 | VBnb;
}

export type GetVTokenInterestRateModelOutput = {
  contractAddress: string;
};

export const getVTokenInterestRateModel = async ({
  vTokenContract,
}: GetVTokenInterestRateModelInput): Promise<GetVTokenInterestRateModelOutput> => {
  const contractAddress = await vTokenContract.interestRateModel();

  return {
    contractAddress,
  };
};
