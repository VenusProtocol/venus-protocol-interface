import { VBep20, VBnbToken } from 'types/contracts';

export interface GetVTokenInterestRateModelInput {
  vTokenContract: VBep20 | VBnbToken;
}

export type GetVTokenInterestRateModelOutput = string;

const getVTokenInterestRateModel = async ({
  vTokenContract,
}: GetVTokenInterestRateModelInput): Promise<GetVTokenInterestRateModelOutput> =>
  vTokenContract.methods.interestRateModel().call();

export default getVTokenInterestRateModel;
