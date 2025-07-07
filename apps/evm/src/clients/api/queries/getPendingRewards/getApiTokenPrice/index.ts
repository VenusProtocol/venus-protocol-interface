import BigNumber from 'bignumber.js';
import type { ChainId } from 'types';
import { restService } from 'utilities';
import type { Address } from 'viem';

export interface GetApiTokenPriceInput {
  tokenAddresses: string[];
  chainId: ChainId;
}
export type GetApiTokenPriceOutput = Record<Address, BigNumber>;

interface ApiTokenPrice {
  id: string;
  chainId: ChainId;
  createdAt: string;
  hasErrorFetchingPrice: false;
  isPriceInvalid: boolean;
  priceMantissa: string;
  priceOracleAddress: null | string;
  priceSource: string;
  tokenAddress: string;
  tokenWrappedAddress: null | string;
  updatedAt: string;
}

export interface ApiTokenPriceResponse {
  result: {
    address: string;
    chainId: ChainId;
    createdAt: string;
    decimals: number;
    name: string;
    symbol: string;
    tokenPrices: ApiTokenPrice[];
    updatedAt: string;
  }[];
}

export const getApiTokenPrice = async ({
  tokenAddresses,
  chainId,
}: GetApiTokenPriceInput): Promise<GetApiTokenPriceOutput> => {
  const response = await restService<ApiTokenPriceResponse>({
    endpoint: '/price',
    method: 'GET',
    params: {
      tokens: JSON.stringify(tokenAddresses),
      chainId,
    },
    next: true,
  });

  if (response.data && 'error' in response.data) {
    throw new Error(response.data.error);
  }

  const result = response.data?.result || [];

  return result.reduce((acc, tokenPrice) => {
    const priceRef =
      tokenPrice.tokenPrices.find(
        t => t.priceSource === 'Merkl' || t.priceSource === 'Coingecko',
      ) || tokenPrice.tokenPrices[0];

    return {
      ...acc,
      [tokenPrice.address]: new BigNumber(priceRef.priceMantissa),
    };
  }, {});
};
