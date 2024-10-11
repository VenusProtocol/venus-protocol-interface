import { type MutationKey, type MutationObserverOptions, useMutation } from '@tanstack/react-query';
import type { BaseContract, ContractReceipt } from 'ethers';

import type { ContractTransaction, ContractTxData, TransactionType } from 'types';

import { useResendPayingGasModalStore } from 'containers/ResendPayingGasModal';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { sendTransaction } from './sendTransaction';
import { CONFIRMATIONS, useTrackTransaction } from './useTrackTransaction';

export interface UseSendTransactionOptions<TMutateInput extends Record<string, unknown> | void>
  extends MutationObserverOptions<unknown, Error, TMutateInput> {
  disableGaslessTransaction?: boolean;
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
>(
  input: UseSendTransactionInput<TMutateInput, TContract, TMethodName>,
) => {
  const { openModal } = useResendPayingGasModalStore();
  const { fn, fnKey, transactionType, onConfirmed, onReverted, options } = input;
  // a transaction should be gas free when using a chain that supports the feature and when the optional
  // disableGaslessTransaction flag is not present or set to true
  const isGaslessTransactionsEnabled =
    useIsFeatureEnabled({ name: 'gaslessTransactions' }) && !options?.disableGaslessTransaction;
  const trackTransaction = useTrackTransaction({ transactionType });

  return useMutation({
    mutationKey: fnKey,
    mutationFn: async mutationInput => {
      // get transaction data from the passed input
      const txData = await fn(mutationInput);

      // send the normal or gas-less transaction
      const transaction = await sendTransaction({
        txData,
        retryCallback: () => openModal(input, mutationInput),
        isGaslessTransaction: isGaslessTransactionsEnabled,
      });

      // Track transaction's progress in the background
      trackTransaction({
        transaction,
        onConfirmed: onConfirmedInput =>
          onConfirmed?.({ ...onConfirmedInput, input: mutationInput }),
        onReverted: onRevertedInput => onReverted?.({ ...onRevertedInput, input: mutationInput }),
      });

      if (options?.waitForConfirmation) {
        // Only return when transaction has been confirmed
        await transaction.wait(CONFIRMATIONS);
      }
    },
    ...options,
  });
};
