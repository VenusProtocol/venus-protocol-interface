import { ChainId, type Market, type Token } from 'types';
import { areAddressesEqual, restService } from 'utilities';
import type { ApiMarketData } from '../getApiMarkets';
import formatToMarket from '../getApiMarkets/formatToMarket';

export interface ApiPoolData {
  address: string;
  name: string;
  markets: ApiMarketData[];
}

export interface GetApiPoolsResponse {
  result: ApiPoolData[];
  request: { addresses: string[] };
}

export interface GetApiPoolsInput {
  xvs: Token;
  chainId: ChainId;
  corePoolComptrollerContractAddress: string;
}

export interface GetApiPoolsOutput {
  pools: {
    address: string;
    name: string;
    isIsolated: boolean;
    markets: Market[];
  }[];
}

const getPools = async ({
  chainId,
  corePoolComptrollerContractAddress,
  xvs,
}: GetApiPoolsInput): Promise<GetApiPoolsOutput> => {
  const response = await restService<GetApiPoolsResponse>({
    endpoint: '/pools',
    method: 'GET',
  });

  const payload = response.data;

  if (payload && 'error' in payload) {
    throw new Error(payload.error);
  }

  return {
    pools: (payload?.result || []).map(p => ({
      address: p.address,
      name: p.name,
      isIsolated:
        (chainId === ChainId.BSC_MAINNET || chainId === ChainId.BSC_TESTNET) &&
        !areAddressesEqual(corePoolComptrollerContractAddress, p.address),
      markets: p.markets.map(apiMarket => formatToMarket({ apiMarket, xvs })),
    })),
  };
};

export default getPools;
