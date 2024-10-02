import config from 'config';
import type { BaseContract } from 'ethers';
import { logError } from 'libs/errors';
import { ChainId, type ContractTransaction } from 'types';
import { http, type Address, createPublicClient, createWalletClient, custom } from 'viem';
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
    from: `0x${string}`;
    to: `0x${string}`;
    data: `0x${string}`;
    value: number;
    customData: {
      paymasterParams: {
        paymaster: `0x${string}`;
        paymasterInput: `0x${string}`;
      };
      gasPerPubdata: number;
    };
    maxFeePerGas: number;
    gasLimit: number;
  };
}

export async function requestGaslessTransaction<
  TContract extends BaseContract,
  TMethodName extends string & keyof TContract['functions'],
>(
  contract: TContract,
  methodName: TMethodName,
  ...args: Parameters<TContract['functions'][TMethodName]>
): Promise<ContractTransaction> {
  const chainId = await contract.signer.getChainId();
  if (chainId === ChainId.ZKSYNC_MAINNET || chainId === ChainId.ZKSYNC_SEPOLIA) {
    const accountAddress = (await contract.signer.getAddress()) as Address;
    const txData = {
      to: contract.address,
      from: accountAddress,
      data: contract.interface.encodeFunctionData(methodName, args),
    };

    const payload = {
      chainId,
      sponsorshipRatio: 100,
      txData,
    };

    try {
      const response = await fetch(config.zyFi.sponsoredPaymasterEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': config.zyFi.apiKey,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error, status: ${response.status}`);
      }

      const chain = chainId === ChainId.ZKSYNC_MAINNET ? zksync : zksyncSepoliaTestnet;

      const { txData } = (await response.json()) as ZyFiSponsoredTxResponse;
      const publicClient = createPublicClient({
        chain,
        transport: http(config.rpcUrls[chainId]),
      }).extend(eip712WalletActions());

      const walletClient = createWalletClient({
        chain,
        transport: custom(window.ethereum),
      }).extend(eip712WalletActions());

      const nonce = await publicClient.getTransactionCount({
        address: accountAddress,
      });
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
      // return a normal transaction
      return contract.functions[methodName](...args);
    }
  }

  return contract.functions[methodName](...args);
}
