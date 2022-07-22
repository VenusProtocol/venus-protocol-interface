import type { TransactionReceipt } from 'web3-core/types';

import { VrtConverter } from 'types/contracts';

export interface ConvertVrtInput {
  vrtConverterContract: VrtConverter;
  amountWei: string;
  accountAddress: string;
}

export type ConvertVrtOutput = TransactionReceipt;

const convertVrt = async ({
  vrtConverterContract,
  amountWei,
  accountAddress,
}: ConvertVrtInput): Promise<ConvertVrtOutput> =>
  vrtConverterContract.methods.convert(amountWei).send({
    from: accountAddress,
  });

export default convertVrt;
