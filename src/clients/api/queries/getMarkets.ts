import BigNumber from 'bignumber.js';
import { restService } from 'utilities';
import { VBEP_TOKENS } from 'constants/tokens';
import { Market, TokenId } from 'types';

export interface IGetMarketsResponse {
  dailyVenus: number;
  markets: Market[];
  request: { addresses: string[] };
  venusRate: string;
}

export interface IGetMarketsOutput {
  markets: Market[];
  dailyVenusWei: BigNumber | undefined;
}

const getMarkets = async (): Promise<IGetMarketsOutput> => {
  const response = await restService<IGetMarketsResponse>({
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
          id: activeMarket.underlyingSymbol.toLowerCase() as TokenId,
          tokenPrice: new BigNumber(activeMarket.tokenPrice),
          liquidity: new BigNumber(activeMarket.liquidity),
          borrowVenusApy: new BigNumber(activeMarket.borrowVenusApy),
          borrowApy: new BigNumber(activeMarket.borrowApy),
          supplyVenusApy: new BigNumber(activeMarket.supplyVenusApy),
          supplyApy: new BigNumber(activeMarket.supplyApy),
          treasuryTotalBorrowsCents: new BigNumber(activeMarket.totalBorrowsUsd).times(100),
          treasuryTotalSupplyCents: new BigNumber(activeMarket.totalSupplyUsd).times(100),
        };
        return [...acc, formattedActiveMarket];
      }
      return acc;
    }, []);
  }
  return { markets, dailyVenusWei };
};

export default getMarkets;
