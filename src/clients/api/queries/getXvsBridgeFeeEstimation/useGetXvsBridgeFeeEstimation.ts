import BigNumber from 'bignumber.js';
import { QueryObserverOptions, useQuery } from 'react-query';

import {
  GetXvsBridgeEstimationInput,
  GetXvsBridgeEstimationOutput,
  getXvsBridgeFeeEstimation,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useGetXVSProxyOFTDestContract, useGetXVSProxyOFTSrcContract } from 'packages/contracts';
import { useChainId } from 'packages/wallet';
import { ChainId, Token } from 'types';
import { callOrThrow, generatePseudoRandomRefetchInterval } from 'utilities';

type TrimmedGetXvsBridgeEstimationInput = Omit<GetXvsBridgeEstimationInput, 'tokenBridgeContract'>;

export type UseGetTokenBalancesQueryKey = [
  FunctionKey.GET_XVS_BRIDGE_FEE_ESTIMATION,
  {
    accountAddress: string;
    amountMantissa: BigNumber;
    chainId: ChainId;
  },
];

type Options = QueryObserverOptions<
  GetXvsBridgeEstimationOutput,
  Error,
  GetXvsBridgeEstimationOutput,
  GetXvsBridgeEstimationOutput,
  UseGetTokenBalancesQueryKey
>;

interface UseGetTokenUsdPriceInput extends Omit<TrimmedGetXvsBridgeEstimationInput, 'token'> {
  token?: Token;
}

const refetchInterval = generatePseudoRandomRefetchInterval();

const useGetXvsBridgeFeeEstimation = (
  { accountAddress, amountMantissa, destinationChain }: UseGetTokenUsdPriceInput,
  options?: Options,
) => {
  const { chainId } = useChainId();
  const tokenBridgeContractSrc = useGetXVSProxyOFTSrcContract({ chainId });
  const tokenBridgeContractDest = useGetXVSProxyOFTDestContract({ chainId });
  const tokenBridgeContract =
    chainId === ChainId.SEPOLIA || chainId === ChainId.ETHEREUM
      ? tokenBridgeContractDest
      : tokenBridgeContractSrc;

  return useQuery(
    [
      FunctionKey.GET_XVS_BRIDGE_FEE_ESTIMATION,
      {
        accountAddress,
        amountMantissa,
        chainId,
      },
    ],
    () =>
      callOrThrow(
        { tokenBridgeContract, accountAddress, amountMantissa, destinationChain },
        params => getXvsBridgeFeeEstimation({ ...params }),
      ),
    {
      refetchInterval,
      ...options,
    },
  );
};

export default useGetXvsBridgeFeeEstimation;
