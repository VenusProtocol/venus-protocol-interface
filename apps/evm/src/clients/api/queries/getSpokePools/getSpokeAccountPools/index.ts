import type { ChainId } from 'types';
import { restService } from 'utilities';
import type { Address } from 'viem';

import type { ApiSpokeAccountPool, GetSpokePositionsResponse } from '../types';

export interface GetSpokeAccountPoolsInput {
  chainId: ChainId;
  accountAddress: Address;
}

export const getSpokeAccountPools = async ({
  chainId,
  accountAddress,
}: GetSpokeAccountPoolsInput): Promise<ApiSpokeAccountPool[]> => {
  const response = await restService<GetSpokePositionsResponse>({
    endpoint: '/spoke/positions',
    method: 'GET',
    params: {
      chainId,
      account: accountAddress,
    },
  });

  const payload = response.data;

  // Positions only enrich the markets, so missing ones leave the pools usable without user data
  if (!payload || 'error' in payload) {
    return [];
  }

  return payload.result ?? [];
};
