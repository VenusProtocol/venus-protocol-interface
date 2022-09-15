import BigNumber from 'bignumber.js';
import { Market, TokenId } from 'types';
import { restService } from 'utilities';

import { VBEP_TOKENS } from 'constants/tokens';

export interface GetMarketsResponse {
  dailyVenus: number;
  markets: Market[];
  request: { addresses: string[] };
  venusRate: string;
}

export interface GetMarketsOutput {
  markets: Market[];
  dailyVenusWei: BigNumber | undefined;
}

const getMarkets = async (): Promise<GetMarketsOutput> => {
  const response = await restService<GetMarketsResponse>({
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

    markets = response.data?.data.markets.reduce<Market[]>(
      (acc, market) =>
        // Only return listed tokens
        Object.keys(VBEP_TOKENS).some(
          vBepToken => vBepToken.toLowerCase() === market.underlyingSymbol.toLowerCase(),
        )
          ? [
              ...acc,
              {
                ...market,
                id: market.underlyingSymbol.toLowerCase() as TokenId,
                tokenPrice: new BigNumber(market.tokenPrice),
                liquidity: new BigNumber(market.liquidity),
                borrowVenusApr: new BigNumber(market.borrowVenusApr),
                borrowVenusApy: new BigNumber(market.borrowVenusApy),
                borrowApy: new BigNumber(market.borrowApy),
                supplyVenusApr: new BigNumber(market.supplyVenusApr),
                supplyVenusApy: new BigNumber(market.supplyVenusApy),
                supplyApy: new BigNumber(market.supplyApy),
                treasuryTotalBorrowsCents: new BigNumber(market.totalBorrowsUsd).times(100),
                treasuryTotalSupplyCents: new BigNumber(market.totalSupplyUsd).times(100),
              },
            ]
          : acc,
      [],
    );
  }

  return { markets, dailyVenusWei };
};

export default getMarkets;
