import formatToMarket from 'clients/api/queries/getApiMarkets/formatToMarket';
import { getToken } from 'libs/tokens/utilities/getToken';
import apiMarketsResponse from '../api/markets.json';

import { ChainId, type Market } from 'types';

const xvs = getToken({ chainId: ChainId.BSC_TESTNET, symbol: 'XVS' });
export const markets: Market[] = apiMarketsResponse.result.map(apiMarket =>
  formatToMarket({ apiMarket, xvs: xvs! }),
);
