import { VError } from 'libs/errors';
import type { ChainId, SpokePool, Token } from 'types';
import { areAddressesEqual, restService } from 'utilities';
import type { Address, PublicClient } from 'viem';

import { getTokenBalances } from '../getTokenBalances';
import { formatToSpokePool } from './formatToSpokePool';
import { getSpokeAccountPools } from './getSpokeAccountPools';
import type { GetSpokePoolsResponse } from './types';

export * from './types';

export interface GetSpokePoolsInput {
  chainId: ChainId;
  tokens: Token[];
  publicClient: PublicClient;
  accountAddress?: Address;
}

export interface GetSpokePoolsOutput {
  spokePools: SpokePool[];
}

export const getSpokePools = async ({
  chainId,
  tokens,
  publicClient,
  accountAddress,
}: GetSpokePoolsInput): Promise<GetSpokePoolsOutput> => {
  const response = await restService<GetSpokePoolsResponse>({
    endpoint: '/spoke/pools',
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

  const [userAccountPools, userTokenBalances] = accountAddress
    ? await Promise.all([
        getSpokeAccountPools({ chainId, accountAddress }),
        getTokenBalances({ publicClient, accountAddress, tokens: underlyingTokens }).then(
          ({ tokenBalances }) => tokenBalances,
        ),
      ])
    : [[], []];

  const spokePools = apiPools.map(apiPool =>
    formatToSpokePool({
      apiPool,
      chainId,
      tokens,
      isUserConnected: !!accountAddress,
      userAccountPool: userAccountPools.find(accountPool =>
        areAddressesEqual(accountPool.comptrollerAddress, apiPool.address),
      ),
      userTokenBalances,
    }),
  );

  return { spokePools };
};
