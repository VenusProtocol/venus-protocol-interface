import BigNumber from 'bignumber.js';
import { VaiController } from 'packages/contractsNew';

export interface GetVaiRepayAmountWithInterestsInput {
  accountAddress: string;
  vaiControllerContract: VaiController;
}

export type GetVaiRepayAmountWithInterestsOutput = {
  vaiRepayAmountWithInterestsWei: BigNumber;
};
