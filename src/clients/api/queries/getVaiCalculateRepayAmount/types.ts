import BigNumber from 'bignumber.js';
import { ContractTypeByName } from 'packages/contracts';

export interface GetVaiCalculateRepayAmountInput {
  accountAddress: string;
  repayAmountWei: BigNumber;
  vaiControllerContract: ContractTypeByName<'vaiController'>;
}

export type GetVaiCalculateRepayAmountOutput = {
  vaiRepayAmountAfterFeeWei: BigNumber;
  vaiCurrentInterestWei: BigNumber;
  vaiPastInterestWei: BigNumber;
  vaiTotalInterestWei: BigNumber;
  feePercentage: number;
};
