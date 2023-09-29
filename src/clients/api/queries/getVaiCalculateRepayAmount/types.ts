import BigNumber from 'bignumber.js';
import { VaiController } from 'packages/contractsNew';

export interface GetVaiCalculateRepayAmountInput {
  accountAddress: string;
  repayAmountWei: BigNumber;
  vaiControllerContract: VaiController;
}

export type GetVaiCalculateRepayAmountOutput = {
  vaiRepayAmountAfterFeeWei: BigNumber;
  vaiCurrentInterestWei: BigNumber;
  vaiPastInterestWei: BigNumber;
  vaiTotalInterestWei: BigNumber;
  feePercentage: number;
};
