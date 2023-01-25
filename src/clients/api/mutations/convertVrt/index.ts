import BigNumber from 'bignumber.js';
import { ContractReceipt } from 'ethers';

import { VrtConverter } from 'types/contracts';

export interface ConvertVrtInput {
  vrtConverterContract: VrtConverter;
  amountWei: BigNumber;
}

export type ConvertVrtOutput = ContractReceipt;

const convertVrt = async ({
  vrtConverterContract,
  amountWei,
}: ConvertVrtInput): Promise<ConvertVrtOutput> => {
  const transaction = await vrtConverterContract.convert(amountWei.toFixed());
  return transaction.wait(1);
};

export default convertVrt;
