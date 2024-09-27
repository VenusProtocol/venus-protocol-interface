import config from 'config';
import type { BaseContract, ContractTransaction } from 'ethers';
import { VError, logError } from 'libs/errors';
import { ChainId } from 'types';
import { Signer, Web3Provider } from 'zksync-ethers';

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
    const txData = {
      to: contract.address,
      from: await contract.signer.getAddress(),
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

      const provider = new Web3Provider(window.ethereum);
      const signer = Signer.from(provider.getSigner(), provider);
      const { txData } = (await response.json()) as ZyFiSponsoredTxResponse;
      const tx = signer.sendTransaction(txData);
      return tx;
    } catch (error) {
      logError(error);
      throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
    }
  }

  return contract.functions[methodName](...args);
}
