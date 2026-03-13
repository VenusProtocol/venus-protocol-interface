import BigNumber from 'bignumber.js';
import { resilientOracleAbi } from 'libs/contracts';
import { VError } from 'libs/errors';
import type { Token } from 'types';
import { convertPriceMantissaToDollars } from 'utilities';
import type { Address, PublicClient } from 'viem';

export interface GetTokenListUsdPriceInput {
  tokens: Token[];
  publicClient: PublicClient;
  resilientOracleAddress: Address;
}

export type GetTokenListUsdPriceOutput = {
  tokenPriceUsd: BigNumber | undefined;
  error?: VError<'unexpected'>;
}[];

export const getTokenListUsdPrice = async ({
  tokens,
  publicClient,
  resilientOracleAddress,
}: GetTokenListUsdPriceInput): Promise<GetTokenListUsdPriceOutput> => {
  const priceMantissaResps = await publicClient.multicall({
    contracts: tokens.map(token => ({
      address: resilientOracleAddress,
      abi: resilientOracleAbi,
      functionName: 'getPrice',
      args: [token.address],
    })),
  });

  return priceMantissaResps.map((resp, index) => {
    if (resp.status === 'failure')
      return {
        tokenPriceUsd: undefined,
        error: new VError({ type: 'unexpected', code: 'somethingWentWrong' }),
      };

    return {
      tokenPriceUsd: convertPriceMantissaToDollars({
        priceMantissa: new BigNumber(resp.result?.toString() ?? 0),
        decimals: tokens[index].decimals,
      }),
    };
  });
};
