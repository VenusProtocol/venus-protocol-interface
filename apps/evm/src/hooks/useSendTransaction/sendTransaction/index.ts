import type { GetFusionQuotePayload, MeeClient } from '@biconomy/abstractjs';
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
  type PublicClient,
  type WalletClient,
  type WriteContractParameters,
  encodeFunctionData,
} from 'viem';
import { eip712WalletActions } from 'viem/zksync';

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

export type SendNormalTransactionInput<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends ContractFunctionName<TAbi, 'payable' | 'nonpayable'>,
  TArgs extends ContractFunctionArgs<TAbi, 'payable' | 'nonpayable', TFunctionName>,
> = {
  txData: WriteContractParameters<TAbi, TFunctionName, TArgs, Chain, Account>;
  gasless: boolean;
  walletClient: WalletClient;
  publicClient: PublicClient;
  chainId: ChainId;
  accountAddress: Address;
};

export type SendBiconomyTransactionInput = {
  txData: GetFusionQuotePayload;
  meeClient: MeeClient;
};

export const sendTransaction = async <
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends ContractFunctionName<TAbi, 'payable' | 'nonpayable'>,
  TArgs extends ContractFunctionArgs<TAbi, 'payable' | 'nonpayable', TFunctionName>,
>(
  input: SendNormalTransactionInput<TAbi, TFunctionName, TArgs> | SendBiconomyTransactionInput,
) => {
  if ('meeClient' in input) {
    const { hash: transactionHash } = await input.meeClient!.executeFusionQuote({
      fusionQuote: input.txData,
    });

    return { transactionHash };
  }

  const { txData, accountAddress, walletClient, publicClient, chainId, gasless } = input;

  const {
    abi: _abi,
    address: _address,
    functionName: _functionName,
    args: _args,
    chain: _chain,
    account: _account,
    value,
    // Extract overrides
    ...txOverrides
  } = txData;

  const txDataPayload = {
    ...txOverrides,
    ...(value
      ? {
          // Stringify value to avoid BigInt serialization issues
          value: value.toString(),
        }
      : {}),
    to: txData.address,
    from: accountAddress,
    data: encodeFunctionData({
      abi: txData.abi,
      functionName: txData.functionName,
      args: txData.args,
      address: txData.address,
    } as EncodeFunctionDataParameters),
  };

  if (!gasless) {
    // Estimate gas limit
    const { from, ...estimationTxData } = txDataPayload;
    const gas = await publicClient.estimateGas({ ...estimationTxData, account: from });
    // Add buffer to make sure transaction has enough gas
    const gasLimit = BigInt((Number(gas) * (1 + GAS_LIMIT_BUFFER_PERCENTAGE / 100)).toFixed(0));

    // Send normal transaction
    const formattedTxData = {
      ...txData,
      gas: gasLimit,
    } as WriteContractParameters<
      TAbi,
      TFunctionName,
      TArgs,
      Chain | undefined,
      Account | undefined
    >;

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

  const extendedWalletClient = walletClient.extend(eip712WalletActions());

  const txPayload = {
    account: accountAddress,
    to: zyFiTxData.to,
    value: BigInt(zyFiTxData.value),
    chain: extendedWalletClient.chain,
    gas: BigInt(zyFiTxData.gasLimit),
    gasPerPubdata: BigInt(zyFiTxData.customData.gasPerPubdata),
    maxFeePerGas: BigInt(zyFiTxData.maxFeePerGas),
    maxPriorityFeePerGas: BigInt(0),
    data: zyFiTxData.data,
    nonce,
    paymaster: zyFiTxData.customData.paymasterParams.paymaster,
    paymasterInput: zyFiTxData.customData.paymasterParams.paymasterInput,
  };

  const txRequest = await extendedWalletClient.prepareTransactionRequest(txPayload);
  // @ts-expect-error Typescript is unable to properly infer the type of txRequest, despite being correct
  const signature = await extendedWalletClient.signTransaction(txRequest);
  const transactionHash = await extendedWalletClient.sendRawTransaction({
    serializedTransaction: signature,
  });

  return {
    transactionHash,
  };
};
