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

export interface IGetMarketsOutput {
  markets: Market[];
  dailyVenus: BigNumber | undefined;
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
  let dailyVenus;
  if (response && response.data && response.data.data) {
    dailyVenus = new BigNumber(response.data.data.dailyVenus);
    markets = Object.keys(VBEP_TOKENS)
      .map(item =>
        response.data?.data.markets.find(
          (market: Market) => market.underlyingSymbol.toLowerCase() === item.toLowerCase(),
        ),
      )
      .filter(notUndefined);
  }
  return { markets, dailyVenus };
};

export default getMarkets;
