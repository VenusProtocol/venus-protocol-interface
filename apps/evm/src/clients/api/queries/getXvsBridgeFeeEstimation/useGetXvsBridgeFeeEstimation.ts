import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';
import type BigNumber from 'bignumber.js';

import {
  type GetXvsBridgeEstimationInput,
  type GetXvsBridgeEstimationOutput,
  getXvsBridgeFeeEstimation,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useGetXVSProxyOFTDestContract, useGetXVSProxyOFTSrcContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import { ChainId, type Token } from 'types';
import { callOrThrow, generatePseudoRandomRefetchInterval } from 'utilities';

type TrimmedGetXvsBridgeEstimationInput = Omit<GetXvsBridgeEstimationInput, 'tokenBridgeContract'>;

export type UseGetXvsBridgeFeeEstimationKey = [
  FunctionKey.GET_XVS_BRIDGE_FEE_ESTIMATION,
  {
    accountAddress: string;
    amountMantissa: BigNumber;
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

interface UseGetXvsBridgeFeeEstimationInput
  extends Omit<TrimmedGetXvsBridgeEstimationInput, 'token'> {
  token?: Token;
}

const refetchInterval = generatePseudoRandomRefetchInterval();

export const useGetXvsBridgeFeeEstimation = (
  { accountAddress, amountMantissa, destinationChain }: UseGetXvsBridgeFeeEstimationInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const tokenBridgeContractSrc = useGetXVSProxyOFTSrcContract({ chainId });
  const tokenBridgeContractDest = useGetXVSProxyOFTDestContract({ chainId });
  const tokenBridgeContract =
    chainId === ChainId.BSC_MAINNET || chainId === ChainId.BSC_TESTNET
      ? tokenBridgeContractSrc
      : tokenBridgeContractDest;

  return useQuery({
    queryKey: [
      FunctionKey.GET_XVS_BRIDGE_FEE_ESTIMATION,
      {
        accountAddress,
        amountMantissa,
        chainId,
        destinationChain,
      },
    ],

    queryFn: () =>
      callOrThrow(
        { tokenBridgeContract, accountAddress, amountMantissa, destinationChain },
        params => getXvsBridgeFeeEstimation({ ...params }),
      ),

    refetchInterval,
    ...options,
  });
};
