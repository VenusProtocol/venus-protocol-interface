import { VError } from 'libs/errors';
import type { ChainId, LiquidityHub, Token } from 'types';
import { restService } from 'utilities';

import type { ApiLiquidityHub } from 'types';
import { formatToLiquidityHub } from 'utilities/formatToLiquidityHub';
import type { Address } from 'viem';

export interface GetLiquidityHubInput {
  chainId: ChainId;
  tokens: Token[];
  accountAddress?: Address;
  vhTokenAddress: Address;
}

export interface GetLiquidityHubResponse {
  hub?: ApiLiquidityHub;
  error?: string;
}

export interface GetLiquidityHubOutput {
  liquidityHub?: LiquidityHub;
}

export const getLiquidityHub = async ({
  chainId,
  tokens,
  accountAddress,
  vhTokenAddress,
}: GetLiquidityHubInput): Promise<GetLiquidityHubOutput> => {
  const response = await restService<GetLiquidityHubResponse>({
    endpoint: `/liquidity-hub/hubs/${vhTokenAddress}`,
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

  const liquidityHub = payload.hub
    ? formatToLiquidityHub({ apiLiquidityHub: payload.hub, tokens })
    : undefined;

  return {
    liquidityHub,
  };
};
