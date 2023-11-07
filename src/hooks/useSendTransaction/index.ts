import { ContractReceipt, ContractTransaction } from 'ethers';
import { MutationObserverOptions, useMutation } from 'react-query';

import FunctionKey from 'constants/functionKey';

import { CONFIRMATIONS, useTrackTransaction } from './useTrackTransaction';

export interface UseSendTransactionOptions<TMutateInput extends Record<string, unknown> | void>
  extends MutationObserverOptions<unknown, Error, TMutateInput> {
  waitForConfirmation?: boolean;
}

export interface UseSendTransactionInput<TMutateInput extends Record<string, unknown> | void> {
  fn: (input: TMutateInput) => Promise<ContractTransaction>;
  fnKey: FunctionKey | [FunctionKey, ...unknown[]];
  onConfirmed?: (input: {
    transaction: ContractTransaction;
    transactionReceipt: ContractReceipt;
    input: TMutateInput;
  }) => Promise<unknown> | unknown;
  onReverted?: (input: {
    transaction: ContractTransaction;
    input: TMutateInput;
  }) => Promise<unknown> | unknown;
  options?: UseSendTransactionOptions<TMutateInput>;
}

export const useSendTransaction = <TMutateInput extends Record<string, unknown> | void>({
  fn,
  fnKey,
  onConfirmed,
  onReverted,
  options,
}: UseSendTransactionInput<TMutateInput>) => {
  const trackTransaction = useTrackTransaction();

  return useMutation(
    fnKey,
    async input => {
      // Send transaction
      const transaction = await fn(input);

      // Track transaction's progress in the background
      trackTransaction({
        transaction,
        onConfirmed: onConfirmedInput => onConfirmed?.({ ...onConfirmedInput, input }),
        onReverted: onRevertedInput => onReverted?.({ ...onRevertedInput, input }),
      });

      if (options?.waitForConfirmation) {
        // Only return when transaction has been confirmed
        await transaction.wait(CONFIRMATIONS);
      }
    },
    options,
  );
};
