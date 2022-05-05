import type { TransactionReceipt } from 'web3-core/types';
import { VrtConverter } from 'types/contracts';

export interface IConvertVrtInput {
  vrtConverterContract: VrtConverter;
  amount: string;
  accountAddress: string;
}

export type ConvertVrtOutput = TransactionReceipt;

const convertVrt = async ({
  vrtConverterContract,
  amount,
  accountAddress,
}: IConvertVrtInput): Promise<ConvertVrtOutput> =>
  vrtConverterContract.methods.convert(amount).send({
    from: accountAddress,
  });

export default convertVrt;
