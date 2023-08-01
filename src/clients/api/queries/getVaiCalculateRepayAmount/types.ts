import BigNumber from 'bignumber.js';
import { Multicall } from 'ethereum-multicall';

export interface GetVaiCalculateRepayAmountInput {
  accountAddress: string;
  multicall: Multicall;
  repayAmountWei: BigNumber;
  vaiControllerContractAddress: string;
}

export type GetVaiCalculateRepayAmountOutput = {
  vaiRepayAmountAfterFeeWei: BigNumber;
  vaiCurrentInterestWei: BigNumber;
  vaiPastInterestWei: BigNumber;
  vaiTotalInterestWei: BigNumber;
  feePercentage: number;
};
