import BigNumber from 'bignumber.js';

import { VaiController } from 'packages/contracts';

export interface GetVaiRepayAmountWithInterestsInput {
  accountAddress: string;
  vaiControllerContract: VaiController;
}

export type GetVaiRepayAmountWithInterestsOutput = {
  vaiRepayAmountWithInterestsMantissa: BigNumber;
};
