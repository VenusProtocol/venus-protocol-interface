import { type MutationObserverOptions, useMutation } from '@tanstack/react-query';

import type { TransactionType } from 'types';

import { useGetPaymasterInfo } from 'clients/api';
import { store as resendPayingGasModalStore } from 'containers/ResendPayingGasModal/store';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useUserChainSettings } from 'hooks/useUserChainSettings';
import { VError } from 'libs/errors';
import { useAccountAddress, useChainId } from 'libs/wallet';
import type {
  Abi,
  Account,
  Chain,
  ContractFunctionArgs,
  ContractFunctionName,
  TransactionReceipt,
  WriteContractParameters,
} from 'viem';
import { useConfig } from 'wagmi';
import { sendTransaction } from './sendTransaction';
import { useTrackTransaction } from './useTrackTransaction';

export interface UseSendTransactionOptions<TMutateInput extends Record<string, unknown> | void>
  extends MutationObserverOptions<unknown, Error, TMutateInput> {
  waitForConfirmation?: boolean;
  tryGasless?: boolean;
}

export interface UseSendTransactionInput<
  TMutateInput extends Record<string, unknown> | void,
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends ContractFunctionName<TAbi, 'payable' | 'nonpayable'>,
  TArgs extends ContractFunctionArgs<TAbi, 'payable' | 'nonpayable', TFunctionName>,
> {
  fn: (
    input: TMutateInput,
  ) =>
    | WriteContractParameters<TAbi, TFunctionName, TArgs, Chain, Account>
    | Promise<WriteContractParameters<TAbi, TFunctionName, TArgs, Chain, Account>>;
  transactionType?: TransactionType;
  onConfirmed?: (input: {
    transactionHash: string;
    transactionReceipt: TransactionReceipt;
    input: TMutateInput;
  }) => Promise<unknown> | unknown;
  onReverted?: (input: {
    transactionHash: string;
    input: TMutateInput;
  }) => Promise<unknown> | unknown;
  options?: UseSendTransactionOptions<TMutateInput>;
}

type LastFailedGaslessTransaction<TMutateInput extends Record<string, unknown> | void> =
  UseSendTransactionInput<TMutateInput, any, any, any> & {
    mutationInput: TMutateInput;
  };

export const useSendTransaction = <
  TMutateInput extends Record<string, unknown> | void,
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends ContractFunctionName<TAbi, 'payable' | 'nonpayable'>,
  TArgs extends ContractFunctionArgs<TAbi, 'payable' | 'nonpayable', TFunctionName>,
>(
  input: UseSendTransactionInput<TMutateInput, TAbi, TFunctionName, TArgs>,
) => {
  const { fn, transactionType, onConfirmed, onReverted, options } = input;
  const tryGasless = options?.tryGasless ?? true;

  const wagmiConfig = useConfig();
  const { accountAddress } = useAccountAddress();

  const { chainId } = useChainId();

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
    mutationFn: async mutationInput => {
      if (!accountAddress) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      // Get transaction data from the passed input
      const txData = await fn(mutationInput);

      // Send the normal or gas-less transaction
      const { transactionHash } = await sendTransaction<TAbi, TFunctionName, TArgs>({
        wagmiConfig,
        txData,
        chainId,
        accountAddress,
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
          } as LastFailedGaslessTransaction<TMutateInput>,
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
