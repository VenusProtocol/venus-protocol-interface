import BigNumber from 'bignumber.js';

import { VaiController } from 'packages/contracts';

export interface GetVaiCalculateRepayAmountInput {
  accountAddress: string;
  repayAmountMantissa: BigNumber;
  vaiControllerContract: VaiController;
}

export type GetVaiCalculateRepayAmountOutput = {
  vaiRepayAmountAfterFeeMantissa: BigNumber;
  vaiCurrentInterestMantissa: BigNumber;
  vaiPastInterestMantissa: BigNumber;
  vaiTotalInterestMantissa: BigNumber;
  feePercentage: number;
};
