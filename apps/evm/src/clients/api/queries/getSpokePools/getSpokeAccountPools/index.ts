import { VError } from 'libs/errors';
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

  if (payload && 'error' in payload) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
      data: { exception: payload.error },
    });
  }

  if (!payload) {
    throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
  }

  return payload.result ?? [];
};
