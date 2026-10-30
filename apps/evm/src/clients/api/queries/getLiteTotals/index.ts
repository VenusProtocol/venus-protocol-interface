import BigNumber from 'bignumber.js';

import { VError } from 'libs/errors';
import type { ChainId } from 'types';
import { restService } from 'utilities';

export interface GetLiteTotalsInput {
  chainId: ChainId;
}

export interface GetLiteTotalsOutput {
  totalSupplyCents: BigNumber;
  availableLiquidityCents: BigNumber;
}

export interface GetLiteTotalsResponse {
  totalSupplyUsdCents?: string;
  availableLiquidityUsdCents?: string;
}

export const getLiteTotals = async ({
  chainId,
}: GetLiteTotalsInput): Promise<GetLiteTotalsOutput> => {
  const response = await restService<GetLiteTotalsResponse>({
    endpoint: '/lite/totals',
    method: 'GET',
    params: {
      chainId,
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

  if (!payload?.totalSupplyUsdCents || !payload?.availableLiquidityUsdCents) {
    throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
  }

  return {
    totalSupplyCents: new BigNumber(payload.totalSupplyUsdCents),
    availableLiquidityCents: new BigNumber(payload.availableLiquidityUsdCents),
  };
};
