import { getPublicClient, getWalletClient } from '@wagmi/core';
import config from 'config';
import { VError, logError } from 'libs/errors';
import { ZYFI_SPONSORED_PAYMASTER_ENDPOINT } from 'libs/wallet';
import type { ChainId } from 'types';
import {
  type Abi,
  type Account,
  type Address,
  type Chain,
  type ContractFunctionArgs,
  type ContractFunctionName,
  type EncodeFunctionDataParameters,
  type Hash,
  type WriteContractParameters,
  encodeFunctionData,
} from 'viem';
import { eip712WalletActions } from 'viem/zksync';
import type { Config as WagmiConfig } from 'wagmi';

const GAS_ESTIMATION_FAILED_ERROR = 'Gas estimation failed';
export const GAS_LIMIT_BUFFER_PERCENTAGE = 35;

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

export const sendTransaction = async <
  const abi extends Abi | readonly unknown[],
  functionName extends ContractFunctionName<abi, 'payable' | 'nonpayable'>,
  args extends ContractFunctionArgs<abi, 'payable' | 'nonpayable', functionName>,
  TAbi extends Abi | readonly unknown[] = abi,
  TFunctionName extends ContractFunctionName<TAbi, 'payable' | 'nonpayable'> = functionName,
  TArgs extends ContractFunctionArgs<TAbi, 'payable' | 'nonpayable', TFunctionName> = args,
>({
  txData,
  gasless,
  wagmiConfig,
  chainId,
  accountAddress,
}: {
  txData: WriteContractParameters<TAbi, TFunctionName, TArgs, Chain, Account>;
  gasless: boolean;
  wagmiConfig: WagmiConfig;
  chainId: ChainId;
  accountAddress: Address;
}) => {
  const publicClient = getPublicClient(wagmiConfig, { chainId });

  if (!publicClient) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
    });
  }

  const walletClient = (
    await getWalletClient(wagmiConfig, { chainId, account: accountAddress })
  ).extend(eip712WalletActions());

  let txOverrides: Record<string, any> = {};

  const {
    abi: _abi,
    address: _address,
    functionName: _functionName,
    args: _args,
    chain: _chain,
    account: _account,
    // Extract overrides
    ...overrides
  } = txData;

  txOverrides = overrides;

  const txDataPayload = {
    ...txOverrides,
    to: txData.address,
    from: accountAddress,
    data: encodeFunctionData({
      abi: txData.abi,
      functionName: txData.functionName,
      args: txData.args,
      address: txData.address,
    } as EncodeFunctionDataParameters),
  };

  // Estimate gas limit
  let gasLimit: undefined | bigint;
  if (!gasless) {
    const { from, ...estimationTxData } = txDataPayload;
    const gas = await publicClient.estimateGas({ ...estimationTxData, account: from });
    // Add buffer to make sure transaction has enough gas
    gasLimit = BigInt((Number(gas) * (1 + GAS_LIMIT_BUFFER_PERCENTAGE / 100)).toFixed(0));
  }

  // Send normal transaction
  if (!gasless) {
    const formattedTxData: WriteContractParameters<TAbi, TFunctionName, TArgs, Chain, Account> = {
      ...txData,
      gas: gasLimit,
    };

    const transactionHash = await walletClient.writeContract(formattedTxData);
    return { transactionHash };
  }

  // Send gasless transaction
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
    logError(body.error);

    // When receiving a gas estimation failed error, there is no need to show the resend paying gas
    // modal, as it would also fail to estimate the gas cost
    if (body?.error === GAS_ESTIMATION_FAILED_ERROR) {
      throw new VError({
        type: 'unexpected',
        code: 'gasEstimationFailed',
      });
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

  const txRequest = await walletClient.prepareTransactionRequest(txPayload);
  const signature = await walletClient.signTransaction(txRequest);
  const transactionHash = await walletClient.sendRawTransaction({
    serializedTransaction: signature,
  });

  return {
    transactionHash,
  };
};
