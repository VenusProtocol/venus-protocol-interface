import BigNumber from 'bignumber.js';
import { Market } from 'types';
import { restService } from 'utilities';

import { VBEP_TOKENS } from 'constants/tokens';

export interface GetMainMarketsResponse {
  dailyVenus: number;
  markets: Market[];
  request: { addresses: string[] };
  venusRate: string;
}

export interface GetMainMarketsOutput {
  markets: Market[];
  dailyVenusWei: BigNumber | undefined;
}

const getMainMarkets = async (): Promise<GetMainMarketsOutput> => {
  const response = await restService<GetMainMarketsResponse>({
    endpoint: '/governance/venus',
    method: 'GET',
  });
  if ('result' in response && response.result === 'error') {
    throw new Error(response.message);
  }

  let markets: Market[] = [];
  let dailyVenusWei;

  if (response && response.data && response.data.data) {
    dailyVenusWei = new BigNumber(response.data.data.dailyVenus);
    markets = Object.keys(VBEP_TOKENS).reduce<Market[]>((acc: Market[], curr: string) => {
      const activeMarket = response.data?.data.markets.find(
        (market: Market) => market.underlyingSymbol.toLowerCase() === curr.toLowerCase(),
      );
      if (activeMarket) {
        const formattedActiveMarket = {
          ...activeMarket,
          id: activeMarket.underlyingSymbol.toLowerCase(),
          tokenPrice: new BigNumber(activeMarket.tokenPrice),
          liquidity: new BigNumber(activeMarket.liquidity),
          borrowVenusApy: new BigNumber(activeMarket.borrowVenusApy),
          borrowVenusApr: new BigNumber(activeMarket.borrowVenusApr),
          borrowApy: new BigNumber(activeMarket.borrowApy),
          supplyVenusApr: new BigNumber(activeMarket.supplyVenusApr),
          supplyVenusApy: new BigNumber(activeMarket.supplyVenusApy),
          supplyApy: new BigNumber(activeMarket.supplyApy),
          borrowBalanceCents: new BigNumber(activeMarket.totalBorrowsUsd).times(100),
          supplyBalanceCents: new BigNumber(activeMarket.totalSupplyUsd).times(100),
        };
        return [...acc, formattedActiveMarket];
      }
      return acc;
    }, []);
  }

  return { markets, dailyVenusWei };
};

export default getMainMarkets;
