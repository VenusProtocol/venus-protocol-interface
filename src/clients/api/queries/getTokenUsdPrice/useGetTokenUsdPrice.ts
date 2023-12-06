import { QueryObserverOptions, useQuery } from 'react-query';

import { GetTokenUsdPriceInput, GetTokenUsdPriceOutput, getTokenUsdPrice } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useGetResilientOracleContract } from 'packages/contracts';
import { useChainId } from 'packages/wallet';
import { ChainId, Token } from 'types';
import { callOrThrow } from 'utilities';

type TrimmedGetTokenUsdPriceInput = Omit<GetTokenUsdPriceInput, 'resilientOracleContract'>;

export type UseGetTokenBalancesQueryKey = [
  FunctionKey.GET_TOKEN_USD_PRICE,
  {
    tokenAddress: string;
    chainId: ChainId;
  },
];

type Options = QueryObserverOptions<
  GetTokenUsdPriceOutput,
  Error,
  GetTokenUsdPriceOutput,
  GetTokenUsdPriceOutput,
  UseGetTokenBalancesQueryKey
>;

interface UseGetTokenUsdPriceInput extends Omit<TrimmedGetTokenUsdPriceInput, 'token'> {
  token?: Token;
}

const useGetTokenUsdPrice = ({ token }: UseGetTokenUsdPriceInput, options?: Options) => {
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
