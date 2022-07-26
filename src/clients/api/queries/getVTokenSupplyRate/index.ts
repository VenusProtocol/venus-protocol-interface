import BigNumber from 'bignumber.js';

import { InterestModel } from 'types/contracts';

export interface GetVTokenSupplyRateInput {
  interestModelContract: InterestModel;
  cashAmountWei: BigNumber;
  borrowsAmountWei: BigNumber;
  reservesAmountWei: BigNumber;
  reserveFactorMantissa: BigNumber;
}

export type IGetVTokenSupplyRateOutput = {
  supplyRateWei: BigNumber;
};

const getVTokenSupplyRate = async ({
  interestModelContract,
  cashAmountWei,
  borrowsAmountWei,
  reservesAmountWei,
  reserveFactorMantissa,
}: GetVTokenSupplyRateInput): Promise<IGetVTokenSupplyRateOutput> => {
  const res = await interestModelContract.methods
    .getSupplyRate(
      cashAmountWei.toFixed(),
      borrowsAmountWei.toFixed(),
      reservesAmountWei.toFixed(),
      reserveFactorMantissa.toFixed(),
    )
    .call();

  return {
    supplyRateWei: new BigNumber(res),
  };
};
export default getVTokenSupplyRate;
