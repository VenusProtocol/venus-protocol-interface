import type { TransactionReceipt } from 'web3-core/types';
import { VrtConverter } from 'types/contracts';

export interface IConvertVrtInput {
  vrtConverterContract: VrtConverter;
  amountWei: string;
  accountAddress: string;
}

export type ConvertVrtOutput = TransactionReceipt;

const convertVrt = async ({
  vrtConverterContract,
  amountWei,
  accountAddress,
}: IConvertVrtInput): Promise<ConvertVrtOutput> =>
  vrtConverterContract.methods.convert(amountWei).send({
    from: accountAddress,
  });

export default convertVrt;
