import type { ChainId } from '@venusprotocol/chains';
import { VError } from 'libs/errors';
import { restService } from 'utilities';

export type AccountNetWorthHistoryPeriod = 'year' | 'halfyear' | 'month';

export type ApiAccountNetWorthHistoryDataPoint = {
  blockNumber: string;
  netWorthCents: string;
  blockTimestampMs: string;
};

export type AccountNetWorthHistoryDataPoint = {
  blockNumber: string;
  netWorthCents: string;
  blockTimestampMs: number;
};

export interface AccountNetWorthHistoryApiResponse {
  performanceDataPoints: ApiAccountNetWorthHistoryDataPoint[];
}

export interface GetAccountNetWorthHistoryInput {
  accountAddress: string;
  chainId: ChainId;
  period: AccountNetWorthHistoryPeriod;
}

export interface GetAccountNetWorthHistoryOutput {
  accountNetWorthHistory: AccountNetWorthHistoryDataPoint[];
}

export const getAccountNetWorthHistory = async ({
  chainId,
  accountAddress,
  period,
}: GetAccountNetWorthHistoryInput): Promise<GetAccountNetWorthHistoryOutput> => {
  const response = await restService<AccountNetWorthHistoryApiResponse>({
    endpoint: '/account/performance',
    method: 'GET',
    params: {
      chainId,
      account: accountAddress,
      period,
    },
  });

  const payload = response.data;

  if (payload && 'error' in payload) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
      data: { message: payload.error },
    });
  }

  if (!payload) {
    throw new VError({ type: 'unexpected', code: 'somethingWentWrongRetrievingVoterHistory' });
  }

  return {
    accountNetWorthHistory: payload.performanceDataPoints.map(data => ({
      ...data,
      blockTimestampMs: Number(data.blockTimestampMs),
    })),
  };
};
