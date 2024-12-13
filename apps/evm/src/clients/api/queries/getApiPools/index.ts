import type { ChainId, Market } from 'types';
import { restService } from 'utilities';
import type { ApiMarketData } from '../getApiMarkets';
import formatToPool from './formatToPool';

export interface ApiPoolData {
  address: string;
  name: string;
  description: string | null;
  markets: ApiMarketData[];
}

export interface GetApiPoolsResponse {
  result: ApiPoolData[];
  request: { addresses: string[] };
}

export interface GetApiPoolsInput {
  chainId: ChainId;
  corePoolComptrollerContractAddress: string;
}

export interface GetApiPoolsOutput {
  pools: {
    address: string;
    name: string;
    description: string;
    isIsolated: boolean;
    markets: Market[];
  }[];
}

const getPools = async ({
  chainId,
  corePoolComptrollerContractAddress,
}: GetApiPoolsInput): Promise<GetApiPoolsOutput> => {
  const response = await restService<GetApiPoolsResponse>({
    endpoint: '/pools',
    method: 'GET',
    params: {
      chainId,
    },
  });

  const payload = response.data;

  if (payload && 'error' in payload) {
    throw new Error(payload.error);
  }

  return {
    pools: (payload?.result || []).map(apiPoolData =>
      formatToPool({ apiPoolData, corePoolComptrollerContractAddress, chainId }),
    ),
  };
};

export default getPools;
