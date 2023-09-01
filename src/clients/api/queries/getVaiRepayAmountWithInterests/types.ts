import BigNumber from 'bignumber.js';
import { Multicall as Multicall3 } from 'ethereum-multicall';

export interface GetVaiRepayAmountWithInterestsInput {
  multicall3: Multicall3;
  accountAddress: string;
  vaiControllerContractAddress: string;
}

export type GetVaiRepayAmountWithInterestsOutput = {
  vaiRepayAmountWithInterestsWei: BigNumber;
};
