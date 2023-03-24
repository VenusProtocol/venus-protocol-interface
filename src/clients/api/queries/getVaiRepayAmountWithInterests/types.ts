import BigNumber from 'bignumber.js';
import { Multicall } from 'ethereum-multicall';

export interface GetVaiRepayAmountWithInterestsInput {
  multicall: Multicall;
  accountAddress: string;
}

export type GetVaiRepayAmountWithInterestsOutput = {
  vaiRepayAmountWithInterests: BigNumber;
};
