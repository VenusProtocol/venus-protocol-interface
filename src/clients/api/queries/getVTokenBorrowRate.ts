import BigNumber from 'bignumber.js';

import { InterestModel } from 'types/contracts';

export interface IGetVTokenBorrowRateInput {
  interestModelContract: InterestModel;
  cashAmountWei: BigNumber;
  borrowsAmountWei: BigNumber;
  reservesAmountWei: BigNumber;
}

export type IGetVTokenBorrowRateOutput = BigNumber;

const getVTokenBorrowRate = async ({
  interestModelContract,
  cashAmountWei,
  borrowsAmountWei,
  reservesAmountWei,
}: IGetVTokenBorrowRateInput): Promise<IGetVTokenBorrowRateOutput> => {
  const borrowRate = await interestModelContract.methods
    .getBorrowRate(cashAmountWei.toFixed(), borrowsAmountWei.toFixed(), reservesAmountWei.toFixed())
    .call();
  return new BigNumber(borrowRate);
};

export default getVTokenBorrowRate;
