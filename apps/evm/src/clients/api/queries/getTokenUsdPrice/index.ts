import type BigNumber from 'bignumber.js';
import { resilientOracleAbi } from 'libs/contracts';
import type { Token } from 'types';
import { convertPriceMantissaToDollars } from 'utilities';
import type { Address, PublicClient } from 'viem';

export interface GetTokenUsdPriceInput {
  token: Token;
  publicClient: PublicClient;
  resilientOracleAddress: Address;
}

export interface GetTokenUsdPriceOutput {
  tokenPriceUsd: BigNumber;
}

export const getTokenUsdPrice = async ({
  token,
  publicClient,
  resilientOracleAddress,
}: GetTokenUsdPriceInput): Promise<GetTokenUsdPriceOutput> => {
  const priceMantissa = await publicClient.readContract({
    address: resilientOracleAddress,
    abi: resilientOracleAbi,
    functionName: 'getPrice',
    args: [token.address],
  });

  const tokenPriceUsd = convertPriceMantissaToDollars({
    priceMantissa: priceMantissa.toString(),
    decimals: token.decimals,
  });

  return { tokenPriceUsd };
};
