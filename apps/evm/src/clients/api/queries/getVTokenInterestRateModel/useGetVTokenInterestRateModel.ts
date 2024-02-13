import { useGetVTokenContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import { QueryObserverOptions, useQuery } from 'react-query';

import getVTokenInterestRateModel, {
  GetVTokenInterestRateModelOutput,
} from 'clients/api/queries/getVTokenInterestRateModel';
import FunctionKey from 'constants/functionKey';
import { ChainId, VToken } from 'types';
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

const useGetVTokenInterestRateModel = ({ vToken }: { vToken: VToken }, options?: Options) => {
  const { chainId } = useChainId();
  const vTokenContract = useGetVTokenContract({ vToken });

  return useQuery(
    [FunctionKey.GET_V_TOKEN_INTEREST_RATE_MODEL, { vTokenAddress: vToken.address, chainId }],
    () => callOrThrow({ vTokenContract }, getVTokenInterestRateModel),
    options,
  );
};

export default useGetVTokenInterestRateModel;
