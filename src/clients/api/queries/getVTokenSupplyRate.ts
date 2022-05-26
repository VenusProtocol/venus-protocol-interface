import BigNumber from 'bignumber.js';

import { InterestModel } from 'types/contracts';

export interface IGetVTokenSupplyRateInput {
  interestModelContract: InterestModel;
  cashAmountWei: BigNumber;
  borrowsAmountWei: BigNumber;
  reservesAmountWei: BigNumber;
  reserveFactorMantissa: BigNumber;
}

export type IGetVTokenSupplyRateOutput = BigNumber;

const getVTokenSupplyRate = async ({
  interestModelContract,
  cashAmountWei,
  borrowsAmountWei,
  reservesAmountWei,
  reserveFactorMantissa,
}: IGetVTokenSupplyRateInput): Promise<IGetVTokenSupplyRateOutput> => {
  const supplyRate = await interestModelContract.methods
    .getSupplyRate(
      cashAmountWei.toFixed(),
      borrowsAmountWei.toFixed(),
      reservesAmountWei.toFixed(),
      reserveFactorMantissa.toFixed(),
    )
    .call();
  return new BigNumber(supplyRate);
};
export default getVTokenSupplyRate;
