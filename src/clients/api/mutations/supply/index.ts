import BigNumber from 'bignumber.js';
import { ContractReceipt, Signer } from 'ethers';
import { VToken } from 'types';

import { getVTokenContract } from 'clients/contracts';
import { VBep20, VBnbToken } from 'types/contracts';

export interface SupplyInput {
  vToken: VToken;
  amountWei: BigNumber;
  signer?: Signer;
}

export type SupplyOutput = ContractReceipt;

const supply = async ({ signer, vToken, amountWei }: SupplyInput): Promise<SupplyOutput> => {
  // Handle supplying BNB
  // TODO: check isNative prop of underlying token instead (?)
  if (vToken.symbol === 'vBNB') {
    const tokenContract = getVTokenContract(vToken, signer) as VBnbToken;

    const transaction = await tokenContract.mint({
      value: amountWei.toFixed(),
    });
    return transaction.wait(1);
  }

  // Handle supplying tokens other that BNB
  const tokenContract = getVTokenContract(vToken, signer) as VBep20;
  const transaction = await tokenContract.mint(amountWei.toFixed());
  return transaction.wait(1);
};

export default supply;
