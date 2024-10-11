import config from 'config';
import type { BaseContract } from 'ethers';
import { VError, logError } from 'libs/errors';
import { ChainId, type ContractTransaction, type ContractTxData } from 'types';
import {
  http,
  type Address,
  type Hash,
  createPublicClient,
  createWalletClient,
  custom,
} from 'viem';
import { zksync, zksyncSepoliaTestnet } from 'viem/chains';
import { eip712WalletActions } from 'viem/zksync';

export interface SponsorableTransaction {
  txData: {
    to: string;
    from: string;
    data: string;
  };
  txPromise: Promise<ContractTransaction>;
}

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

export interface RetryTransaction {
  callback: () => Promise<void>;
}

export async function sendTransaction<
  TContract extends BaseContract,
  TMethodName extends string & keyof TContract['functions'],
>({
  txData,
  retryCallback,
  isGaslessTransaction,
}: {
  txData: ContractTxData<TContract, TMethodName>;
  retryCallback: () => void;
  isGaslessTransaction: boolean;
}): Promise<ContractTransaction> {
  const { contract, methodName, args, overrides } = txData;
  if (isGaslessTransaction) {
    try {
      const chainId = (await contract.signer.getChainId()) as ChainId;
      const accountAddress = (await contract.signer.getAddress()) as Address;
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

      const chain = chainId === ChainId.ZKSYNC_MAINNET ? zksync : zksyncSepoliaTestnet;

      const publicClient = createPublicClient({
        chain,
        transport: http(config.rpcUrls[chainId]),
      }).extend(eip712WalletActions());

      const walletClient = createWalletClient({
        chain,
        transport: custom(window.ethereum),
      }).extend(eip712WalletActions());

      const [response, nonce] = await Promise.all([
        fetch(config.zyFi.sponsoredPaymasterEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': config.zyFi.apiKey,
          },
          body: JSON.stringify(payload),
        }),
        publicClient.getTransactionCount({
          address: accountAddress,
        }),
      ]);

      if (!response.ok) {
        throw new VError({
          type: 'unexpected',
          code: 'gaslessTransactionNotAvailable',
          errorCallback: retryCallback,
        });
      }

      const { txData } = (await response.json()) as ZyFiSponsoredTxResponse;

      const txPayload = {
        account: accountAddress,
        to: txData.to,
        value: BigInt(txData.value),
        chain,
        gas: BigInt(txData.gasLimit),
        gasPerPubdata: BigInt(txData.customData.gasPerPubdata),
        maxFeePerGas: BigInt(txData.maxFeePerGas),
        maxPriorityFeePerGas: BigInt(0),
        data: txData.data,
        paymaster: txData.customData.paymasterParams.paymaster,
        paymasterInput: txData.customData.paymasterParams.paymasterInput,
        nonce,
      };

      const txHash = await walletClient.sendTransaction(txPayload);
      return {
        hash: txHash,
        wait: async (confirmations?: number) =>
          await publicClient.waitForTransactionReceipt({ hash: txHash, confirmations }),
      };
    } catch (error) {
      logError(error);
      throw new VError({
        type: 'unexpected',
        code: 'gaslessTransactionNotAvailable',
        errorCallback: retryCallback,
      });
    }
  }

  return overrides
    ? contract.functions[methodName](...args, overrides)
    : contract.functions[methodName](...args);
}
