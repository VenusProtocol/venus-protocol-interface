import type { ChainId } from 'types';
import { restService } from 'utilities';
import type { Address } from 'viem';
import type { ApiTokenPrice } from '../../useGetPools/getPools/getApiPools';

export interface GetApiTokenPriceInput {
  tokenAddresses: string[];
  chainId: ChainId;
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

export type GetApiTokenPriceOutput = Record<Address, ApiTokenPrice[]>;

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

  return result.reduce((acc, tokenMetadata) => {
    return {
      ...acc,
      [tokenMetadata.address.toLowerCase()]: tokenMetadata.tokenPrices,
    };
  }, {});
};
