import { QueryObserverOptions, useQuery } from 'react-query';

import { GetTokenUsdPriceInput, GetTokenUsdPriceOutput, getTokenUsdPrice } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useGetResilientOracleContract } from 'packages/contracts';
import { useChainId } from 'packages/wallet';
import { ChainId } from 'types';
import { callOrThrow } from 'utilities';

type TrimmedGetTokenUsdPriceInput = Omit<GetTokenUsdPriceInput, 'resilientOracleContract'>;

export type UseGetTokenBalancesQueryKey = [
  FunctionKey.GET_TOKEN_USD_PRICE,
  {
    tokenAddress: string;
    chainId: ChainId;
  },
];

export type Options = QueryObserverOptions<
  GetTokenUsdPriceOutput,
  Error,
  GetTokenUsdPriceOutput,
  GetTokenUsdPriceOutput,
  UseGetTokenBalancesQueryKey
>;

const useGetTokenUsdPrice = ({ token }: TrimmedGetTokenUsdPriceInput, options?: Options) => {
  const { chainId } = useChainId();
  const resilientOracleContract = useGetResilientOracleContract({
    chainId,
  });

  return useQuery(
    [
      FunctionKey.GET_TOKEN_USD_PRICE,
      {
        tokenAddress: token ? token.address : '',
        chainId,
      },
    ],
    () =>
      callOrThrow({ token, resilientOracleContract }, params => getTokenUsdPrice({ ...params })),
    options,
  );
};

export default useGetTokenUsdPrice;
