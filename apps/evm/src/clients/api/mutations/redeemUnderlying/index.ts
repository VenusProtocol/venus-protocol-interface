import BigNumber from 'bignumber.js';
import { ContractTransaction } from 'ethers';

import { VBep20, VBnb } from 'libs/contracts';

export interface RedeemUnderlyingInput {
  vTokenContract: VBep20 | VBnb;
  amountMantissa: BigNumber;
}

export type RedeemUnderlyingOutput = ContractTransaction;

const redeemUnderlying = async ({
  vTokenContract,
  amountMantissa,
}: RedeemUnderlyingInput): Promise<RedeemUnderlyingOutput> =>
  vTokenContract.redeemUnderlying(amountMantissa.toFixed());

export default redeemUnderlying;
