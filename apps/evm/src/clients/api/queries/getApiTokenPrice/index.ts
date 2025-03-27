import BigNumber from 'bignumber.js';
import type { ChainId } from 'types';
import { restService } from 'utilities';
import type { Address } from 'viem';

export interface GetApiTokenPriceInput {
  tokenAddresses: string[];
  chainId: ChainId;
}
export type GetApiTokenPriceOutput = Record<Address, BigNumber>;

interface ApiTokenPriceResponse {
  result: Record<Address, string>;
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
  });

  if (response.data && 'error' in response.data) {
    throw new Error(response.data.error);
  }

  const result = response.data?.result || {};
  return Object.entries(result).reduce(
    (acc, tokenPriceTuple) => ({ ...acc, [tokenPriceTuple[0]]: new BigNumber(tokenPriceTuple[1]) }),
    {},
  );
};
