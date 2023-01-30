import BigNumber from 'bignumber.js';
import { Multicall } from 'ethereum-multicall';

export interface GetVaiCalculateRepayAmountInput {
  multicall: Multicall;
  accountAddress: string;
  repayAmountWei: BigNumber;
}

export type GetVaiCalculateRepayAmountOutput = {
  vaiRepayAmountAfterFeeWei: BigNumber;
  vaiCurrentInterestWei: BigNumber;
  vaiPastInterestWei: BigNumber;
  vaiTotalInterestWei: BigNumber;
  feePercentage: number;
};
