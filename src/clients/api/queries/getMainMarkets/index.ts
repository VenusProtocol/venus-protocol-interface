import BigNumber from 'bignumber.js';
import { Market, Token } from 'types';
import { convertWeiToTokens, restService } from 'utilities';

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

export interface GetMainMarketsInput {
  xvs: Token;
}

export interface GetMainMarketsOutput {
  markets: Market[];
}

const getMainMarkets = async ({ xvs }: GetMainMarketsInput): Promise<GetMainMarketsOutput> => {
  const response = await restService<GetMainMarketsResponse>({
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
    const totalXvsDistributedTokens = apiMarket.totalDistributedMantissa
      ? convertWeiToTokens({
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

export default getMainMarkets;
