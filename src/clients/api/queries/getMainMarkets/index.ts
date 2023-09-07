import BigNumber from 'bignumber.js';
import { Market } from 'types';
import { restService } from 'utilities';

export interface GetMainMarketsResponse {
  dailyVenus: number;
  markets: {
    address: string;
    totalDistributed: string;
    borrowerCount: number;
    supplierCount: number;
  }[];
  request: { addresses: string[] };
  venusRate: string;
}

export interface GetMainMarketsOutput {
  markets: Market[];
}

const getMainMarkets = async (): Promise<GetMainMarketsOutput> => {
  const response = await restService<GetMainMarketsResponse>({
    endpoint: '/markets/core-pool',
    method: 'GET',
  });

  if ('result' in response && response.result === 'error') {
    throw new Error(response.message);
  }

  const markets: Market[] = (response?.data?.data.markets || []).map(apiMarket => ({
    address: apiMarket.address,
    borrowerCount: apiMarket.borrowerCount,
    supplierCount: apiMarket.supplierCount,
    totalXvsDistributedTokens: new BigNumber(apiMarket.totalDistributed),
  }));

  return { markets };
};

export default getMainMarkets;
