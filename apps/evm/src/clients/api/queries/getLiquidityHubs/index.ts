import type { Address } from 'viem';

import { VError } from 'libs/errors';
import type { ApiLiquidityHub, ChainId, LiquidityHub, Token } from 'types';
import { restService } from 'utilities';
import { formatToLiquidityHub } from 'utilities/formatToLiquidityHub';
// TODO: REMOVE ME (VPD-1880)
import { mockCentrifugeYieldGroup } from 'utilities/formatToLiquidityHub/mockCentrifugeYieldGroup';

export interface GetLiquidityHubsInput {
  chainId: ChainId;
  tokens: Token[];
  accountAddress?: Address;
}

export interface GetLiquidityHubsOutput {
  liquidityHubs: LiquidityHub[];
}

export interface GetLiquidityHubsResponse {
  result?: ApiLiquidityHub[];
}

export const getLiquidityHubs = async ({
  chainId,
  tokens,
  accountAddress,
}: GetLiquidityHubsInput): Promise<GetLiquidityHubsOutput> => {
  const response = await restService<GetLiquidityHubsResponse>({
    endpoint: '/liquidity-hub/hubs',
    method: 'GET',
    params: {
      chainId,
      accountAddress,
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

  const liquidityHubs =
    payload.result?.reduce<GetLiquidityHubsOutput['liquidityHubs']>((acc, apiLiquidityHub) => {
      const liquidityHub = formatToLiquidityHub({
        // TODO: REMOVE ME (VPD-1880)
        apiLiquidityHub: mockCentrifugeYieldGroup(apiLiquidityHub),
        tokens,
      });

      if (liquidityHub) {
        acc.push(liquidityHub);
      }

      return acc;
    }, []) ?? [];

  return {
    liquidityHubs,
  };
};
