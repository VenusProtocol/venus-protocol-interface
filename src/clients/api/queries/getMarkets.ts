import BigNumber from 'bignumber.js';
import { restService } from 'utilities';
import { VBEP_TOKENS } from 'constants/tokens';
import { Market } from 'types';
import { notUndefined } from 'utilities/common';

export interface IGetMarketsResponse {
  dailyVenus: number;
  markets: Market[];
  request: { addresses: string[] };
  venusRate: string;
}

export type GetMarketsOutput = { markets: Market[]; dailyVenus: BigNumber | undefined };

const getMarkets = async (): Promise<GetMarketsOutput> => {
  const response = await restService<IGetMarketsResponse>({
    endpoint: '/governance/venus',
    method: 'GET',
  });
  if ('result' in response && response.result === 'error') {
    throw new Error(response.message);
  }
  let markets: Market[] = [];
  let dailyVenus;
  if (response && response.data && response.data.data) {
    dailyVenus = new BigNumber(response.data.data.dailyVenus);
    markets = Object.keys(VBEP_TOKENS)
      .map(item => {
        const activeMarket = response.data?.data.markets.find(
          (market: Market) => market.underlyingSymbol.toLowerCase() === item.toLowerCase(),
        );
        if (activeMarket) {
          activeMarket.id = activeMarket.underlyingSymbol.toLowerCase();
          activeMarket.tokenPrice = new BigNumber(activeMarket.tokenPrice);
          activeMarket.liquidity = new BigNumber(activeMarket.liquidity);
          activeMarket.borrowVenusApy = new BigNumber(activeMarket.borrowVenusApy);
          activeMarket.borrowApy = new BigNumber(activeMarket.borrowApy);
          activeMarket.supplyVenusApy = new BigNumber(activeMarket.supplyVenusApy);
          activeMarket.supplyApy = new BigNumber(activeMarket.supplyApy);
          activeMarket.treasuryTotalBorrowsUsdCents = new BigNumber(
            activeMarket.totalBorrowsUsd,
          ).times(100);
          activeMarket.treasuryTotalSupplyUsdCents = new BigNumber(
            activeMarket.totalSupplyUsd,
          ).times(100);
        }
        return activeMarket;
      })
      .filter(notUndefined);
  }
  return { markets, dailyVenus };
};

export default getMarkets;
