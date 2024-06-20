import BigNumber from 'bignumber.js';

import { getBlockNumber, getTokenBalances } from 'clients/api';
import {
  type GetIsolatedPoolParticipantsCountInput,
  getIsolatedPoolParticipantsCount,
} from 'clients/subgraph';
import { type IsolatedPoolComptroller, getIsolatedPoolComptrollerContract } from 'libs/contracts';
import { logError } from 'libs/errors';
import type { Asset, PrimeApy, Token } from 'types';
import {
  appendPrimeSimulationDistributions,
  areTokensEqual,
  convertAprBipsToApy,
  findTokenByAddress,
} from 'utilities';
import extractSettledPromiseValue from 'utilities/extractSettledPromiseValue';
import removeDuplicates from 'utilities/removeDuplicates';
import formatOutput from './formatOutput';
import getRewardsDistributorSettingsMapping from './getRewardsDistributorSettingsMapping';
import getTokenPriceDollarsMapping from './getTokenPriceDollarsMapping';
import type { GetIsolatedPoolsInput, GetIsolatedPoolsOutput } from './types';

export type { GetIsolatedPoolsInput, GetIsolatedPoolsOutput } from './types';

// Since the borrower and supplier counts aren't essential information, we make the logic so the
// dApp can still function if the subgraph is down
const safelyGetIsolatedPoolParticipantsCount = async ({
  chainId,
}: GetIsolatedPoolParticipantsCountInput) => {
  try {
    const res = await getIsolatedPoolParticipantsCount({ chainId });
    return res;
  } catch (error) {
    logError(error);
  }
};

const getIsolatedPools = async ({
  isolatedPoolsData,
  chainId,
  xvs,
  blocksPerDay,
  accountAddress,
  poolLensContract,
  vTreasuryContractAddress,
  primeContract,
  provider,
  tokens,
}: GetIsolatedPoolsInput): Promise<GetIsolatedPoolsOutput> => {
  const [
    poolParticipantsCountResult,
    currentBlockNumberResult,
    primeVTokenAddressesResult,
    primeMinimumXvsToStakeResult,
    userPrimeTokenResult,
  ] = await Promise.allSettled([
    // Fetch borrower and supplier counts of each isolated token
    safelyGetIsolatedPoolParticipantsCount({ chainId }),
    // Fetch current block number
    getBlockNumber({ provider }),
    // Prime related calls
    primeContract?.getAllMarkets(),
    primeContract?.MINIMUM_STAKED_XVS(),
    accountAddress ? primeContract?.tokens(accountAddress) : undefined,
  ]);

  if (poolParticipantsCountResult.status === 'rejected') {
    throw new Error(poolParticipantsCountResult.reason);
  }

  if (currentBlockNumberResult.status === 'rejected') {
    throw new Error(currentBlockNumberResult.reason);
  }

  // Extract token records and addresses
  const [vTokenAddresses, underlyingTokens] = isolatedPoolsData.pools.reduce<[string[], Token[]]>(
    (acc, poolResult) => {
      const newVTokenAddresses: string[] = [];
      const newUnderlyingTokens: Token[] = [];

      poolResult.markets.forEach(vTokenMetaData => {
        const underlyingToken = findTokenByAddress({
          address: vTokenMetaData.underlyingAddress,
          tokens,
        });

        if (!underlyingToken) {
          logError(`Record missing for underlying token: ${vTokenMetaData.underlyingAddress}`);
          return;
        }

        if (!newVTokenAddresses.includes(vTokenMetaData.address)) {
          newVTokenAddresses.push(vTokenMetaData.address.toLowerCase());
        }

        if (
          !newUnderlyingTokens.some(listedUnderlyingToken =>
            areTokensEqual(listedUnderlyingToken, underlyingToken),
          )
        ) {
          newUnderlyingTokens.push(underlyingToken);
        }
      });

      return [acc[0].concat(newVTokenAddresses), acc[1].concat(newUnderlyingTokens)];
    },
    [[], []],
  );

  // Extract Prime data
  const primeVTokenAddresses = extractSettledPromiseValue(primeVTokenAddressesResult) || [];
  const primeMinimumXvsToStakeMantissa = extractSettledPromiseValue(primeMinimumXvsToStakeResult);
  const isUserPrime = extractSettledPromiseValue(userPrimeTokenResult)?.exists || false;

  // Fetch addresses of user collaterals
  const getAssetsInPromises: ReturnType<IsolatedPoolComptroller['getAssetsIn']>[] = [];

  isolatedPoolsData.pools.forEach(p => {
    const comptrollerContract = getIsolatedPoolComptrollerContract({
      signerOrProvider: provider,
      address: p.address,
    });

    if (accountAddress) {
      getAssetsInPromises.push(comptrollerContract.getAssetsIn(accountAddress));
    }
  });

  const settledGetAssetsInPromises = Promise.allSettled(getAssetsInPromises);
  const tokenBalancesPromises = Promise.allSettled([
    getTokenBalances({
      accountAddress: vTreasuryContractAddress,
      tokens: underlyingTokens,
      provider,
    }),
    accountAddress
      ? poolLensContract.callStatic.vTokenBalancesAll(vTokenAddresses, accountAddress)
      : undefined,
    accountAddress
      ? getTokenBalances({
          accountAddress,
          tokens: underlyingTokens,
          provider,
        })
      : undefined,
  ]);

  // Fetch Prime distributions
  const settledPrimeAprPromises =
    primeContract && isUserPrime
      ? Promise.allSettled(
          accountAddress
            ? primeVTokenAddresses.map(primeVTokenAddress =>
                primeContract.calculateAPR(primeVTokenAddress, accountAddress),
              )
            : [],
        )
      : undefined;

  const [vTreasuryTokenBalancesResult, userVTokenBalancesAllResult, userTokenBalancesResult] =
    await tokenBalancesPromises;
  const userAssetsInResults = await settledGetAssetsInPromises;
  const primeAprResults = (await settledPrimeAprPromises) || [];

  // Log errors without throwing so that assets can still be displayed
  if (vTreasuryTokenBalancesResult?.status === 'rejected') {
    logError(vTreasuryTokenBalancesResult.reason);
  }

  if (userVTokenBalancesAllResult?.status === 'rejected') {
    logError(userVTokenBalancesAllResult.reason);
  }

  if (userTokenBalancesResult?.status === 'rejected') {
    logError(userTokenBalancesResult.reason);
  }

  // Get addresses of user collaterals
  const userCollateralizedVTokenAddresses = removeDuplicates(
    userAssetsInResults.reduce<string[]>((acc, userAssetsInResult) => {
      const result = extractSettledPromiseValue(userAssetsInResult);

      if (!result) {
        return acc;
      }

      return acc.concat(result);
    }, []),
  );

  // Get Prime APYs
  const primeApyMap = new Map<string, PrimeApy>();
  primeAprResults.forEach((primeAprResult, index) => {
    if (primeAprResult.status !== 'fulfilled') {
      return;
    }

    const primeApr = primeAprResult.value;

    const apys: PrimeApy = {
      borrowApy: convertAprBipsToApy({ aprBips: primeApr?.borrowAPR.toString() || '0' }),
      supplyApy: convertAprBipsToApy({ aprBips: primeApr?.supplyAPR.toString() || '0' }),
    };

    primeApyMap.set(primeVTokenAddresses[index], apys);
  });

  // Fetch reward settings
  const rewardsDistributorSettingsMapping = await getRewardsDistributorSettingsMapping({
    pools: isolatedPoolsData.pools,
  });

  // Fetch token prices
  const tokenPriceDollarsMapping = await getTokenPriceDollarsMapping({
    tokens,
    pools: isolatedPoolsData.pools,
    rewardsDistributorSettingsMapping,
  });

  const pools = formatOutput({
    chainId,
    blocksPerDay,
    tokens,
    currentBlockNumber: currentBlockNumberResult.value.blockNumber,
    pools: isolatedPoolsData.pools,
    poolParticipantsCountResult: poolParticipantsCountResult.value,
    rewardsDistributorSettingsMapping,
    tokenPriceDollarsMapping,
    userCollateralizedVTokenAddresses,
    userVTokenBalancesAll: extractSettledPromiseValue(userVTokenBalancesAllResult),
    userTokenBalancesAll: extractSettledPromiseValue(userTokenBalancesResult),
    vTreasuryTokenBalances: extractSettledPromiseValue(vTreasuryTokenBalancesResult),
    primeApyMap,
  });

  // Fetch Prime simulations and add them to distributions
  if (primeContract && primeMinimumXvsToStakeMantissa) {
    await appendPrimeSimulationDistributions({
      assets: pools.reduce<Asset[]>((acc, pool) => acc.concat(pool.assets), []),
      primeContract,
      primeVTokenAddresses,
      accountAddress,
      primeMinimumXvsToStakeMantissa: new BigNumber(primeMinimumXvsToStakeMantissa.toString()),
      xvs,
    });
  }

  return {
    pools,
  };
};

export default getIsolatedPools;
