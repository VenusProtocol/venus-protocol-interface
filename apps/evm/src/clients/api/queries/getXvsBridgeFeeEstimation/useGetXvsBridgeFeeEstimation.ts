import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';

import {
  type GetXvsBridgeEstimationInput,
  type GetXvsBridgeEstimationOutput,
  getXvsBridgeFeeEstimation,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';
import {
  useGetXVSProxyOFTDestContractAddress,
  useGetXVSProxyOFTSrcContractAddress,
} from 'libs/contracts';
import { useChainId, usePublicClient } from 'libs/wallet';
import { ChainId, type Token } from 'types';
import { callOrThrow, generatePseudoRandomRefetchInterval } from 'utilities';

type TrimmedGetXvsBridgeEstimationInput = Omit<
  GetXvsBridgeEstimationInput,
  'publicClient' | 'tokenBridgeContractAddress'
>;

export type UseGetXvsBridgeFeeEstimationKey = [
  FunctionKey.GET_XVS_BRIDGE_FEE_ESTIMATION,
  {
    accountAddress: Address;
    amountMantissa: number;
    chainId: ChainId;
    destinationChain: ChainId;
  },
];

type Options = QueryObserverOptions<
  GetXvsBridgeEstimationOutput,
  Error,
  GetXvsBridgeEstimationOutput,
  GetXvsBridgeEstimationOutput,
  UseGetXvsBridgeFeeEstimationKey
>;

interface UseGetXvsBridgeFeeEstimationInput extends TrimmedGetXvsBridgeEstimationInput {
  token?: Token;
}

const refetchInterval = generatePseudoRandomRefetchInterval();

export const useGetXvsBridgeFeeEstimation = (
  { accountAddress, amountMantissa, destinationChain }: UseGetXvsBridgeFeeEstimationInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const { publicClient } = usePublicClient();

  // Get the contract addresses
  const srcContractAddress = useGetXVSProxyOFTSrcContractAddress();
  const destContractAddress = useGetXVSProxyOFTDestContractAddress();

  const tokenBridgeContractAddress =
    chainId === ChainId.BSC_MAINNET || chainId === ChainId.BSC_TESTNET
      ? srcContractAddress
      : destContractAddress;

  return useQuery({
    queryKey: [
      FunctionKey.GET_XVS_BRIDGE_FEE_ESTIMATION,
      {
        accountAddress,
        amountMantissa: Number(amountMantissa),
        chainId,
        destinationChain,
      },
    ],

    queryFn: () =>
      callOrThrow(
        { tokenBridgeContractAddress, accountAddress, amountMantissa, destinationChain },
        params =>
          getXvsBridgeFeeEstimation({
            ...params,
            publicClient,
          }),
      ),

    refetchInterval,
    ...options,
  });
};
