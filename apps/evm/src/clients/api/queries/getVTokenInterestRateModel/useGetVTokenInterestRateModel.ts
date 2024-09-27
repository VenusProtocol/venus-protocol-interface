import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import type { ChainId } from '@venusprotocol/chains';
import getVTokenInterestRateModel, {
  type GetVTokenInterestRateModelOutput,
} from 'clients/api/queries/getVTokenInterestRateModel';
import FunctionKey from 'constants/functionKey';
import { useGetVTokenContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import type { VToken } from 'types';
import { callOrThrow } from 'utilities';

export type UseGetVTokenInterestRateModelQueryKey = [
  FunctionKey.GET_V_TOKEN_INTEREST_RATE_MODEL,
  { vTokenAddress: string; chainId: ChainId },
];

type Options = QueryObserverOptions<
  GetVTokenInterestRateModelOutput,
  Error,
  GetVTokenInterestRateModelOutput,
  GetVTokenInterestRateModelOutput,
  UseGetVTokenInterestRateModelQueryKey
>;

const useGetVTokenInterestRateModel = (
  { vToken }: { vToken: VToken },
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const vTokenContract = useGetVTokenContract({ vToken });

  return useQuery({
    queryKey: [
      FunctionKey.GET_V_TOKEN_INTEREST_RATE_MODEL,
      { vTokenAddress: vToken.address, chainId },
    ],
    queryFn: () => callOrThrow({ vTokenContract }, getVTokenInterestRateModel),
    ...options,
  });
};

export default useGetVTokenInterestRateModel;
