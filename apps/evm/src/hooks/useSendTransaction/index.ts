import { type MutationKey, type MutationObserverOptions, useMutation } from '@tanstack/react-query';
import type { BaseContract, ContractReceipt } from 'ethers';

import type { ContractTxData, TransactionType } from 'types';

import { useGetPaymasterInfo } from 'clients/api';
import { store as resendPayingGasModalStore } from 'containers/ResendPayingGasModal/store';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useUserChainSettings } from 'hooks/useUserChainSettings';
import { VError } from 'libs/errors';
import { useChainId } from 'libs/wallet';
import { useConfig } from 'wagmi';
import { sendTransaction } from './sendTransaction';
import { useTrackTransaction } from './useTrackTransaction';

export interface LastTransactionData<
  TMutateInput extends Record<string, unknown> | void,
  TContract extends BaseContract,
  TMethodName extends string & keyof TContract['functions'],
> extends UseSendTransactionInput<TMutateInput, TContract, TMethodName> {
  mutationInput: TMutateInput;
}

export interface UseSendTransactionOptions<TMutateInput extends Record<string, unknown> | void>
  extends MutationObserverOptions<unknown, Error, TMutateInput> {
  waitForConfirmation?: boolean;
  tryGasless?: boolean;
}

export interface UseSendTransactionInput<
  TMutateInput extends Record<string, unknown> | void,
  TContract extends BaseContract,
  TMethodName extends string & keyof TContract['functions'],
> {
  fn: (
    input: TMutateInput,
  ) => Promise<ContractTxData<TContract, TMethodName>> | ContractTxData<TContract, TMethodName>;
  fnKey: MutationKey;
  transactionType?: TransactionType;
  onConfirmed?: (input: {
    transactionHash: string;
    transactionReceipt: ContractReceipt;
    input: TMutateInput;
  }) => Promise<unknown> | unknown;
  onReverted?: (input: {
    transactionHash: string;
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
  const { fn, fnKey, transactionType, onConfirmed, onReverted, options } = input;
  const tryGasless = options?.tryGasless ?? true;

  const { chainId } = useChainId();
  const wagmiConfig = useConfig();

  const openResendPayingGasModalStoreModal = resendPayingGasModalStore.use.openModal();

  const [userChainSettings] = useUserChainSettings();

  const { data: getPaymasterInfo, refetch: refetchPaymasterInfo } = useGetPaymasterInfo(
    {
      chainId,
    },
    {
      enabled: tryGasless,
    },
  );
  const paymasterCanSponsorTransactions = !!getPaymasterInfo?.canSponsorTransactions;

  const isGaslessTransactionsFeatureEnabled = useIsFeatureEnabled({ name: 'gaslessTransactions' });
  // a transaction should be gas free when:
  // 1) we're on a chain that supports the feature
  // 2) the gaslessTransactions user setting is set to true
  // 3) the tryGasless option is set to true
  // 4) there are funds in the paymaster wallet
  const shouldTryGasless =
    isGaslessTransactionsFeatureEnabled &&
    !!userChainSettings?.gaslessTransactions &&
    tryGasless &&
    paymasterCanSponsorTransactions;

  const trackTransaction = useTrackTransaction({ transactionType });

  return useMutation({
    mutationKey: fnKey,
    mutationFn: async mutationInput => {
      // Get transaction data from the passed input
      const txData = await fn(mutationInput);

      // Send the normal or gas-less transaction
      const { transactionHash } = await sendTransaction({
        wagmiConfig,
        txData,
        gasless: shouldTryGasless,
      });

      // Track transaction's progress in the background
      const promise = trackTransaction({
        transactionHash,
        onConfirmed: onConfirmedInput =>
          onConfirmed?.({ ...onConfirmedInput, input: mutationInput }),
        onReverted: onRevertedInput => onReverted?.({ ...onRevertedInput, input: mutationInput }),
      });

      if (options?.waitForConfirmation) {
        // Only return when transaction has been confirmed
        await promise;
      }
    },
    onError: (error, variables, context) => {
      if (error instanceof VError && error.code === 'gaslessTransactionNotAvailable') {
        // Refetch paymaster balance in case it went below threshold
        refetchPaymasterInfo();

        // Open modal asking user if they want to send the transaction again by paying for the gas
        // themselves
        openResendPayingGasModalStoreModal({
          lastFailedGaslessTransaction: {
            ...input,
            mutationInput: variables,
          },
        });

        return;
      }

      if (options?.onError) {
        options.onError(error, variables, context);
      }
    },
    ...options,
  });
};
