import BigNumber from 'bignumber.js';

import { VError, logError } from 'libs/errors';
import type { ChainId, SpokePool, Token } from 'types';
import { areAddressesEqual, restService } from 'utilities';
import type { Address, PublicClient } from 'viem';

import { getTokenBalances } from '../getTokenBalances';
import { formatToSpokePool } from './formatToSpokePool';
import { getSpokeUserPositions } from './getSpokeUserPositions';
import type { GetSpokePoolsResponse } from './types';

export * from './types';

const MAX_POOLS_LIMIT = 500;

export interface GetSpokePoolsInput {
  chainId: ChainId;
  tokens: Token[];
  publicClient: PublicClient;
  poolLensContractAddress?: Address;
  accountAddress?: Address;
}

export interface SpokePoolsTotals {
  poolCount: number;
  totalBorrowCents: BigNumber;
  availableLiquidityCents: BigNumber;
}

export interface GetSpokePoolsOutput {
  spokePools: SpokePool[];
  totals: SpokePoolsTotals;
}

export const getSpokePools = async ({
  chainId,
  tokens,
  publicClient,
  poolLensContractAddress,
  accountAddress,
}: GetSpokePoolsInput): Promise<GetSpokePoolsOutput> => {
  const response = await restService<GetSpokePoolsResponse>({
    endpoint: '/spoke/pools',
    method: 'GET',
    params: {
      chainId,
      limit: MAX_POOLS_LIMIT,
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

  const apiPools = payload.result ?? [];

  const underlyingTokens = tokens.filter(token =>
    apiPools.some(apiPool =>
      apiPool.markets.some(
        apiMarket =>
          !!apiMarket.underlyingAddress &&
          areAddressesEqual(apiMarket.underlyingAddress, token.address),
      ),
    ),
  );

  const fetchUserPositions = async (userAccountAddress: Address) => {
    if (!poolLensContractAddress) {
      throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
    }

    return getSpokeUserPositions({
      publicClient,
      poolLensContractAddress,
      apiPools,
      accountAddress: userAccountAddress,
    });
  };

  const [userPositions, userTokenBalances] = accountAddress
    ? await Promise.all([
        fetchUserPositions(accountAddress).catch(error => {
          logError(error);

          return undefined;
        }),
        getTokenBalances({ publicClient, accountAddress, tokens: underlyingTokens }).then(
          ({ tokenBalances }) => tokenBalances,
        ),
      ])
    : [[], []];

  const isUserDataUnavailable = !!accountAddress && !userPositions;

  const spokePools = apiPools.map(apiPool =>
    formatToSpokePool({
      apiPool,
      chainId,
      tokens,
      isUserConnected: !!accountAddress && !isUserDataUnavailable,
      isUserDataUnavailable,
      userPositions: userPositions ?? [],
      userTokenBalances,
    }),
  );

  return {
    spokePools,
    totals: {
      poolCount: payload.totals.poolCount,
      totalBorrowCents: new BigNumber(payload.totals.totalBorrowsUsdCents),
      availableLiquidityCents: new BigNumber(payload.totals.availableLiquidityUsdCents),
    },
  };
};
