import BigNumber from 'bignumber.js';
import { Multicall as Multicall3 } from 'ethereum-multicall';

export interface GetVaiCalculateRepayAmountInput {
  accountAddress: string;
  multicall3: Multicall3;
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
