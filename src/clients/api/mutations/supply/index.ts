import BigNumber from 'bignumber.js';
import { ContractReceipt, Signer } from 'ethers';
import { VBnb, getVTokenContract } from 'packages/contracts';
import { VToken } from 'types';

export interface SupplyInput {
  vToken: VToken;
  amountWei: BigNumber;
  signer: Signer;
}

export type SupplyOutput = ContractReceipt;

const supply = async ({ signer, vToken, amountWei }: SupplyInput): Promise<SupplyOutput> => {
  // Handle supplying BNB
  if (vToken.underlyingToken.isNative) {
    const tokenContract = getVTokenContract({
      vToken,
      signerOrProvider: signer,
    }) as VBnb;

    const transaction = await tokenContract.mint({
      value: amountWei.toFixed(),
    });
    return transaction.wait(1);
  }

  // Handle supplying tokens other that BNB
  const tokenContract = getVTokenContract({ vToken, signerOrProvider: signer });
  const transaction = await tokenContract.mint(amountWei.toFixed());
  return transaction.wait(1);
};

export default supply;
