import { VError } from 'libs/errors';
import type { ChainId, LiquidityHubSnapshot } from 'types';
import { restService } from 'utilities';
import type { Address } from 'viem';

import { formatApiLiquidityHubHistory } from './formatApiLiquidityHubHistory';

export type LiquidityHubHistoryPeriod = '1w' | '1m' | '3m' | '1y' | 'all';

export interface GetLiquidityHubHistoryInput {
  chainId: ChainId;
  vhTokenAddress: Address;
  period: LiquidityHubHistoryPeriod;
}

export interface ApiLiquidityHubSnapshot {
  blockNumber: string;
  blockTimestamp: string;
  supplyApy: string;
  totalSupplyCents: string | null;
  exchangeRateMantissa: string;
  pricePerShare: string;
}

export interface GetLiquidityHubHistoryResponse {
  result?: ApiLiquidityHubSnapshot[];
  range?: LiquidityHubHistoryPeriod;
}

export interface GetLiquidityHubHistoryOutput {
  liquidityHubSnapshots: LiquidityHubSnapshot[];
}

export const getLiquidityHubHistory = async ({
  chainId,
  vhTokenAddress,
  period,
}: GetLiquidityHubHistoryInput): Promise<GetLiquidityHubHistoryOutput> => {
  const response = await restService<GetLiquidityHubHistoryResponse>({
    endpoint: `/liquidity-hub/hubs/${vhTokenAddress}/history`,
    method: 'GET',
    params: {
      chainId,
      range: period,
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

  return {
    liquidityHubSnapshots: formatApiLiquidityHubHistory(payload),
  };
};
