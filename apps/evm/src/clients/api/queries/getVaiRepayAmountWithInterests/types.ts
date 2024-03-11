import type BigNumber from 'bignumber.js';

import type { VaiController } from 'libs/contracts';

export interface GetVaiRepayAmountWithInterestsInput {
  accountAddress: string;
  vaiControllerContract: VaiController;
}

export type GetVaiRepayAmountWithInterestsOutput = {
  vaiRepayAmountWithInterestsMantissa: BigNumber;
};
