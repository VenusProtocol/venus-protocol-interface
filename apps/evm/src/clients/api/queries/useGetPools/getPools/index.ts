import BigNumber from 'bignumber.js';

import { getBlockNumber } from 'clients/api';
import type { GetIsolatedPoolParticipantsCountInput } from 'clients/subgraph';
import type { PoolLens } from 'libs/contracts';
import type { Asset, TokenBalance } from 'types';

import { logError } from 'libs/errors';
import type { GetPoolsInput, GetPoolsOutput, PrimeApy } from '../types';
import { appendPrimeSimulationDistributions } from './appendPrimeSimulationDistributions';
import { formatOutput } from './formatOutput';
import { getApiPools } from './getApiPools';
import { getIsolatedPoolParticipantCounts } from './getIsolatedPoolParticipantCounts';
import { getUserCollateralAddresses } from './getUserCollateralAddresses';
import { getUserPrimeApys } from './getUserPrimeApys';
import { getUserTokenBalances } from './getUserTokenBalances';
import { getUserVaiBorrowBalance } from './getUserVaiBorrowBalance';

const safeGetIsolatedPoolParticipantCount = async (
  input: GetIsolatedPoolParticipantsCountInput,
) => {
  try {
    const result = await getIsolatedPoolParticipantCounts(input);
    return result;
  } catch (error) {
    // Log error without throwing to prevent the entire query from failing, since this relies on a
    // third-party service that could be down and doesn't constitute a critical failure
    logError(error);
  }
};

export const getPools = async ({
  chainId,
  accountAddress,
  primeContract,
  poolLensContract,
  legacyPoolComptrollerContract,
  vaiControllerContract,
  venusLensContract,
  provider,
  tokens,
}: GetPoolsInput) => {
  const [
    { pools: apiPools },
    isolatedPoolParticipantCounts,
    { blockNumber: currentBlockNumber },
    unsafePrimeVTokenAddresses,
    primeMinimumXvsToStakeMantissa,
    userPrimeToken,
  ] = await Promise.all([
    getApiPools({ chainId }),
    safeGetIsolatedPoolParticipantCount({ chainId }),
    // Fetch current block number
    getBlockNumber({ provider }),
    // Prime related calls
    primeContract?.getAllMarkets(), // TODO: get from API
    primeContract?.MINIMUM_STAKED_XVS(), // TODO: get from API
    accountAddress ? primeContract?.tokens(accountAddress) : undefined,
  ]);

  const primeVTokenAddresses = unsafePrimeVTokenAddresses ?? [];
  const isUserPrime = userPrimeToken?.exists || false;

  let userCollateralVTokenAddresses: string[] | undefined;
  let userVTokenBalances:
    | Awaited<ReturnType<PoolLens['callStatic']['vTokenBalancesAll']>>
    | undefined;
  let userTokenBalances: TokenBalance[] | undefined;
  let userVaiBorrowBalanceMantissa: BigNumber | undefined;
  let userPrimeApyMap: Map<string, PrimeApy> | undefined;

  if (accountAddress) {
    const [userCollaterals, userBalances, userVaiBorrowBalance, userPrimeApys] = await Promise.all([
      getUserCollateralAddresses({
        chainId,
        accountAddress,
        legacyPoolComptrollerContract,
        apiPools,
        provider,
      }),
      getUserTokenBalances({
        accountAddress,
        apiPools,
        chainId,
        tokens,
        provider,
        poolLensContract,
        venusLensContract,
      }),
      getUserVaiBorrowBalance({
        accountAddress,
        vaiControllerContract,
      }),
      isUserPrime && primeContract
        ? getUserPrimeApys({
            accountAddress,
            primeContract,
            primeVTokenAddresses,
          })
        : undefined,
    ]);

    userCollateralVTokenAddresses = userCollaterals.userCollateralAddresses;

    userVTokenBalances = [
      ...(userBalances.userIsolatedPoolVTokenBalances || []),
      ...(userBalances.userLegacyPoolVTokenBalances || []),
    ];

    userTokenBalances = userBalances.userTokenBalances?.tokenBalances;

    userVaiBorrowBalanceMantissa = userVaiBorrowBalance.userVaiBorrowBalanceMantissa;

    userPrimeApyMap = userPrimeApys?.userPrimeApyMap;
  }

  const pools = formatOutput({
    chainId,
    tokens,
    currentBlockNumber,
    apiPools,
    isolatedPoolParticipantsCountMap:
      isolatedPoolParticipantCounts?.isolatedPoolParticipantsCountMap,
    userPrimeApyMap,
    userCollateralVTokenAddresses,
    userVTokenBalances,
    userTokenBalances,
    userVaiBorrowBalanceMantissa,
  });

  // Add Prime simulations
  // TODO: get Prime simulations from API
  const xvs = tokens.find(token => token.symbol === 'XVS');
  if (primeContract && primeMinimumXvsToStakeMantissa && xvs) {
    await appendPrimeSimulationDistributions({
      assets: pools.reduce<Asset[]>((acc, pool) => acc.concat(pool.assets), []),
      primeContract,
      primeVTokenAddresses,
      primeMinimumXvsToStakeMantissa: new BigNumber(primeMinimumXvsToStakeMantissa.toString()),
      xvs,
      chainId,
    });
  }

  const output: GetPoolsOutput = {
    pools,
  };

  return output;
};
