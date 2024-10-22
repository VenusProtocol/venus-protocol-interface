import { getPublicClient, getWalletClient } from '@wagmi/core';
import type { Address, Hash } from 'viem';
import { eip712WalletActions } from 'viem/zksync';
import { useConfig } from 'wagmi';

import { useMutation } from '@tanstack/react-query';
import config from 'config';
import FunctionKey from 'constants/functionKey';
import type { BaseContract } from 'ethers';
import { VError, logError } from 'libs/errors';
import { ZYFI_SPONSORED_PAYMASTER_ENDPOINT } from 'libs/wallet/constants';
import type { ChainId, ContractTxData } from 'types';

const GAS_ESTIMATION_FAILED_ERROR = 'Gas estimation failed';

interface ZyFiSponsoredTxResponse {
  txData: {
    chainId: number;
    from: Address;
    to: Address;
    data: Hash;
    value: number;
    customData: {
      paymasterParams: {
        paymaster: Address;
        paymasterInput: Hash;
      };
      gasPerPubdata: number;
    };
    maxFeePerGas: number;
    gasLimit: number;
  };
}

export const useSendContractTransaction = <
  TContract extends BaseContract,
  TMethodName extends string & keyof TContract['functions'],
>() => {
  const wagmiConfig = useConfig();

  return useMutation<
    { hash: string },
    Error,
    {
      txData: ContractTxData<TContract, TMethodName>;
      gasless: boolean;
    }
  >({
    mutationKey: [FunctionKey.SEND_CONTRACT_TRANSACTION],
    mutationFn: async ({ txData, gasless }) => {
      const { contract, methodName, args, overrides } = txData;

      if (!gasless) {
        const { hash } = await (overrides
          ? contract.functions[methodName](...args, overrides)
          : contract.functions[methodName](...args));

        return { hash };
      }

      const [chainId, accountAddress] = await Promise.all([
        contract.signer.getChainId() as Promise<ChainId>,
        contract.signer.getAddress() as Promise<Address>,
      ]);

      const publicClient = getPublicClient(wagmiConfig, { chainId });
      const walletClient = await getWalletClient(wagmiConfig, { chainId, account: accountAddress });

      const txDataPayload = {
        to: contract.address,
        from: accountAddress,
        data: contract.interface.encodeFunctionData(methodName, args),
        ...overrides,
      };

      const payload = {
        chainId,
        sponsorshipRatio: 100,
        txData: txDataPayload,
      };

      const [response, nonce] = await Promise.all([
        fetch(ZYFI_SPONSORED_PAYMASTER_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': config.zyFiApiKey,
          },
          body: JSON.stringify(payload),
        }),
        publicClient.getTransactionCount({
          address: accountAddress,
        }),
      ]);

      if (!response.ok) {
        const body = await response.json();
        logError({ response, body });

        // when receiving a gas estimation failed error, there is no need to show
        // the resend paying gas modal, as it would also fail to estimate the gas cost
        if (body?.error === GAS_ESTIMATION_FAILED_ERROR) {
          throw new Error(GAS_ESTIMATION_FAILED_ERROR);
        }

        throw new VError({
          type: 'unexpected',
          code: 'gaslessTransactionNotAvailable',
        });
      }

      const { txData: zyFiTxData } = (await response.json()) as ZyFiSponsoredTxResponse;

      const txPayload = {
        account: accountAddress,
        to: zyFiTxData.to,
        value: BigInt(zyFiTxData.value),
        chain: walletClient.chain,
        gas: BigInt(zyFiTxData.gasLimit),
        gasPerPubdata: BigInt(zyFiTxData.customData.gasPerPubdata),
        maxFeePerGas: BigInt(zyFiTxData.maxFeePerGas),
        maxPriorityFeePerGas: BigInt(0),
        data: zyFiTxData.data,
        nonce,
        paymaster: zyFiTxData.customData.paymasterParams.paymaster,
        paymasterInput: zyFiTxData.customData.paymasterParams.paymasterInput,
      };

      const txHash = await walletClient.extend(eip712WalletActions()).sendTransaction(txPayload);

      return {
        hash: txHash,
      };
    },
  });
};
