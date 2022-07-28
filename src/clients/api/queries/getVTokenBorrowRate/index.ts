import BigNumber from 'bignumber.js';

import { InterestModel } from 'types/contracts';

export interface GetVTokenBorrowRateInput {
  interestModelContract: InterestModel;
  cashAmountWei: BigNumber;
  borrowsAmountWei: BigNumber;
  reservesAmountWei: BigNumber;
}

export type IGetVTokenBorrowRateOutput = {
  borrowRate: BigNumber;
};

const getVTokenBorrowRate = async ({
  interestModelContract,
  cashAmountWei,
  borrowsAmountWei,
  reservesAmountWei,
}: GetVTokenBorrowRateInput): Promise<IGetVTokenBorrowRateOutput> => {
  const res = await interestModelContract.methods
    .getBorrowRate(cashAmountWei.toFixed(), borrowsAmountWei.toFixed(), reservesAmountWei.toFixed())
    .call();

  return {
    borrowRate: new BigNumber(res),
  };
};

export default getVTokenBorrowRate;
