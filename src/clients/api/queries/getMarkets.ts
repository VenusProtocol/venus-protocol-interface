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

export type GetMarketsOutput = Market[];

const getMarkets = async (): Promise<GetMarketsOutput> => {
  const response = await restService<IGetMarketsResponse>({
    endpoint: '/governance/venus',
    method: 'GET',
  });
  if ('result' in response && response.result === 'error') {
    throw new Error(response.message);
  }
  let data: Market[] = [];

  data = Object.keys(VBEP_TOKENS)
    .map(item => {
      if (response && response.data && response.data.data) {
        return response.data.data.markets.find(
          (market: Market) => market.underlyingSymbol.toLowerCase() === item.toLowerCase(),
        );
      }
      return undefined;
    })
    .filter(notUndefined);
  return data;
};

export default getMarkets;
