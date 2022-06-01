import { VBep20, VBnbToken } from 'types/contracts';

export interface IGetVTokenInterestRateModelInput {
  vTokenContract: VBep20 | VBnbToken;
}

export type GetVTokenInterestRateModelOutput = string;

const getVTokenInterestRateModel = async ({
  vTokenContract,
}: IGetVTokenInterestRateModelInput): Promise<GetVTokenInterestRateModelOutput> =>
  vTokenContract.methods.interestRateModel().call();

export default getVTokenInterestRateModel;
