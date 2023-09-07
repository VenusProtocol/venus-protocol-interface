import BigNumber from 'bignumber.js';
import { Market } from 'types';
import { restService } from 'utilities';

export interface ApiMarket {
  address: string;
  totalDistributedMantissa: string;
  underlyingDecimal: number;
  borrowerCount: number;
  supplierCount: number;
}

export interface GetMainMarketsResponse {
  result: ApiMarket[];
  request: { addresses: string[] };
}

export interface GetMainMarketsOutput {
  markets: Market[];
}

const getMainMarkets = async (): Promise<GetMainMarketsOutput> => {
  const response = await restService<GetMainMarketsResponse, 'v2'>({
    endpoint: '/markets/core-pool',
    method: 'GET',
    next: true,
    params: {
      limit: 50,
    },
  });

  if ('result' in response && response.result === 'error') {
    throw new Error(response.message);
  }

  const markets: Market[] = (response?.data?.result || []).map(apiMarket => {
    const decimalPlaces = new BigNumber(10).pow(apiMarket.underlyingDecimal);
    const totalXvsDistributedTokens = new BigNumber(apiMarket.totalDistributedMantissa).dividedBy(
      decimalPlaces,
    );
    return {
      address: apiMarket.address,
      borrowerCount: apiMarket.borrowerCount,
      supplierCount: apiMarket.supplierCount,
      totalXvsDistributedTokens,
    };
  });

  return { markets };
};

export default getMainMarkets;
