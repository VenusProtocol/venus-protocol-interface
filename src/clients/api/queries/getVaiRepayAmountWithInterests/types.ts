import BigNumber from 'bignumber.js';
import { ContractTypeByName } from 'packages/contracts';

export interface GetVaiRepayAmountWithInterestsInput {
  accountAddress: string;
  vaiControllerContract: ContractTypeByName<'vaiController'>;
}

export type GetVaiRepayAmountWithInterestsOutput = {
  vaiRepayAmountWithInterestsWei: BigNumber;
};
