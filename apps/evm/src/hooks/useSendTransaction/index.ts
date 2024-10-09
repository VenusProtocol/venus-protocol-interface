import { type MutationKey, type MutationObserverOptions, useMutation } from '@tanstack/react-query';
import type { BaseContract, ContractReceipt } from 'ethers';

import type { ContractTransaction, ContractTxData, TransactionType } from 'types';

import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { sendTransaction } from './sendTransaction';
import { CONFIRMATIONS, useTrackTransaction } from './useTrackTransaction';

export interface UseSendTransactionOptions<TMutateInput extends Record<string, unknown> | void>
  extends MutationObserverOptions<unknown, Error, TMutateInput> {
  waitForConfirmation?: boolean;
}

export interface UseSendTransactionInput<
  TMutateInput extends Record<string, unknown> | void,
  TContract extends BaseContract,
  TMethodName extends keyof TContract['functions'],
> {
  fn: (input: TMutateInput) => Promise<ContractTxData<TContract, TMethodName>>;
  fnKey: MutationKey;
  transactionType?: TransactionType;
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

export const useSendTransaction = <
  TMutateInput extends Record<string, unknown> | void,
  TContract extends BaseContract,
  TMethodName extends string & keyof TContract['functions'],
>({
  fn,
  fnKey,
  transactionType,
  onConfirmed,
  onReverted,
  options,
}: UseSendTransactionInput<TMutateInput, TContract, TMethodName>) => {
  const isGaslessTransactionsEnabled = useIsFeatureEnabled({ name: 'gaslessTransactions' });
  const trackTransaction = useTrackTransaction({ transactionType });

  return useMutation({
    mutationKey: fnKey,
    mutationFn: async input => {
      // get transaction data
      const txData = await fn(input);
      // Send transaction
      const transaction = await sendTransaction({
        txData,
        requestGasless: isGaslessTransactionsEnabled,
      });

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
    ...options,
  });
};
