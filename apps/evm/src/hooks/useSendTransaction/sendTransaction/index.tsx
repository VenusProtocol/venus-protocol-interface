import { getPublicClient, getWalletClient } from '@wagmi/core';
import config from 'config';
import type { BaseContract } from 'ethers';
import { VError, logError } from 'libs/errors';
import { ZYFI_SPONSORED_PAYMASTER_ENDPOINT } from 'libs/wallet';
import type { ChainId, ContractTxData } from 'types';
import type { Address, Hash, Hex } from 'viem';
import { eip712WalletActions } from 'viem/zksync';
import type { Config as WagmiConfig } from 'wagmi';

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

export const sendTransaction = async <
  TContract extends BaseContract,
  TMethodName extends string & keyof TContract['functions'],
>({
  txData,
  gasless,
  wagmiConfig,
}: {
  txData: ContractTxData<TContract, TMethodName>;
  gasless: boolean;
  wagmiConfig: WagmiConfig;
}) => {
  const { contract, methodName, args, overrides } = txData;

  const [chainId, accountAddress] = await Promise.all([
    contract.signer.getChainId() as Promise<ChainId>,
    contract.signer.getAddress() as Promise<Address>,
  ]);

  const publicClient = getPublicClient(wagmiConfig, { chainId });

  if (!accountAddress || !chainId || !publicClient) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
    });
  }

  if (!gasless) {
    const formattedArgs = args;
    if (overrides) {
      formattedArgs.push(overrides);
    }

    const { hash: transactionHash }: { hash: Hex } = await contract.functions[methodName](
      ...formattedArgs,
    );

    return { transactionHash };
  }

  const walletClient = (
    await getWalletClient(wagmiConfig, { chainId, account: accountAddress })
  ).extend(eip712WalletActions());

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
    logError(body.error);

    // when receiving a gas estimation failed error, there is no need to show
    // the resend paying gas modal, as it would also fail to estimate the gas cost
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
