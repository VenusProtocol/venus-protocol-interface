import { TENDERLY_DEBUG_ENV_URL } from 'constants/tenderly';
import type { ChainId } from 'types';
import { encodeFunctionData } from 'viem';
import type {
  Abi,
  Account,
  Address,
  Chain,
  ContractFunctionArgs,
  ContractFunctionName,
  EncodeFunctionDataParameters,
  WriteContractParameters,
} from 'viem';

export type GenerateTenderlySimulationUrlInput<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends ContractFunctionName<TAbi, 'payable' | 'nonpayable'>,
  TArgs extends ContractFunctionArgs<TAbi, 'payable' | 'nonpayable', TFunctionName>,
> = {
  txData: WriteContractParameters<TAbi, TFunctionName, TArgs, Chain, Account>;
  chainId: ChainId;
  accountAddress: Address;
};

export const generateTenderlySimulationUrl = <
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends ContractFunctionName<TAbi, 'payable' | 'nonpayable'>,
  TArgs extends ContractFunctionArgs<TAbi, 'payable' | 'nonpayable', TFunctionName>,
>({
  txData,
  chainId,
  accountAddress,
}: GenerateTenderlySimulationUrlInput<TAbi, TFunctionName, TArgs>) => {
  try {
    const rawFunctionInput = encodeFunctionData({
      abi: txData.abi,
      functionName: txData.functionName,
      args: txData.args,
      address: txData.address,
    } as EncodeFunctionDataParameters);

    const tenderlySimulationUrl = new URL(`${TENDERLY_DEBUG_ENV_URL}/simulator/new`);

    tenderlySimulationUrl.searchParams.set('blockIndex', '0');
    tenderlySimulationUrl.searchParams.set('from', accountAddress);
    tenderlySimulationUrl.searchParams.set('value', `${txData.value ?? 0}`);
    tenderlySimulationUrl.searchParams.set('contractAddress', txData.address);
    tenderlySimulationUrl.searchParams.set('network', `${chainId}`);
    tenderlySimulationUrl.searchParams.set('rawFunctionInput', rawFunctionInput);

    return tenderlySimulationUrl.toString();
  } catch {
    return undefined;
  }
};
