import BigNumber from 'bignumber.js';
import { ContractTransaction } from 'ethers';
import { VBep20, VBnb } from 'packages/contracts';

export interface RedeemUnderlyingInput {
  vTokenContract: VBep20 | VBnb;
  amountWei: BigNumber;
}

export type RedeemUnderlyingOutput = ContractTransaction;

const redeemUnderlying = async ({
  vTokenContract,
  amountWei,
}: RedeemUnderlyingInput): Promise<RedeemUnderlyingOutput> =>
  vTokenContract.redeemUnderlying(amountWei.toFixed());

export default redeemUnderlying;
