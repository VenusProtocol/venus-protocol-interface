import BigNumber from 'bignumber.js';

import { VaiController } from 'types/contracts';

export interface GetVaiCalculateRepayAmountInput {
  vaiControllerContract: VaiController;
  accountAddress: string;
  repayAmountWei: BigNumber;
}

export type GetVaiCalculateRepayAmountOutput = {
  vaiToBeBurned: BigNumber;
  vaiCurrentInterest: BigNumber;
  vaiPastInterest: BigNumber;
  feePercentage: number;
};
