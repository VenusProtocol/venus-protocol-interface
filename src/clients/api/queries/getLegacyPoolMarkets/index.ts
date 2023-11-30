import BigNumber from 'bignumber.js';

import { Market, Token } from 'types';
import { convertMantissaToTokens, restService } from 'utilities';

export interface ApiMarket {
  address: string;
  totalDistributedMantissa: string;
  underlyingDecimal: number;
  borrowerCount: number;
  supplierCount: number;
}

export interface GetLegacyPoolMarketsResponse {
  result: ApiMarket[];
  request: { addresses: string[] };
}

export interface GetLegacyPoolMarketsInput {
  xvs: Token;
}

export interface GetLegacyPoolMarketsOutput {
  markets: Market[];
}

const getLegacyPoolMarkets = async ({
  xvs,
}: GetLegacyPoolMarketsInput): Promise<GetLegacyPoolMarketsOutput> => {
  const response = await restService<GetLegacyPoolMarketsResponse>({
    endpoint: '/markets/core-pool',
    method: 'GET',
    params: {
      limit: 50,
    },
  });

  if ('result' in response && response.result === 'error') {
    throw new Error(response.message);
  }

  const markets: Market[] = (response?.data?.result || []).map(apiMarket => {
    const totalXvsDistributedTokens = apiMarket.totalDistributedMantissa
      ? convertMantissaToTokens({
          value: new BigNumber(apiMarket.totalDistributedMantissa),
          token: xvs,
        })
      : new BigNumber(0);

    return {
      address: apiMarket.address,
      borrowerCount: apiMarket.borrowerCount,
      supplierCount: apiMarket.supplierCount,
      totalXvsDistributedTokens,
    };
  });

  return { markets };
};

export default getLegacyPoolMarkets;
