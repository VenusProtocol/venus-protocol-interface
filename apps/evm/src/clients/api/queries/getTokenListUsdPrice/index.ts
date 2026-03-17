import BigNumber from 'bignumber.js';
import { resilientOracleAbi } from 'libs/contracts';
import { logError } from 'libs/errors';
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
    if (resp.status === 'failure') {
      logError(
        `Failed to get ${tokens[index]?.symbol} USD price from Oracle (${resilientOracleAddress})`,
      );
    }

    return {
      tokenPriceUsd: resp.result
        ? convertPriceMantissaToDollars({
            priceMantissa: new BigNumber(resp.result?.toString() ?? 0),
            decimals: tokens[index].decimals,
          })
        : undefined,
    };
  });
};
