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
  chainId,
  xvs,
  blocksPerDay,
  accountAddress,
  poolLensContract,
  poolRegistryContractAddress,
  vTreasuryContractAddress,
  resilientOracleContract,
  primeContract,
  provider,
  tokens,
}: GetIsolatedPoolsInput): Promise<GetIsolatedPoolsOutput> => {
  const [
    poolResults,
    poolParticipantsCountResult,
    currentBlockNumberResult,
    primeVTokenAddressesResult,
    primeMinimumXvsToStakeResult,
    userPrimeTokenResult,
  ] = await Promise.allSettled([
    // Fetch all pools
    poolLensContract.getAllPools(poolRegistryContractAddress),
    // Fetch borrower and supplier counts of each isolated token
    safelyGetIsolatedPoolParticipantsCount({ chainId }),
    // Fetch current block number
    getBlockNumber({ provider }),
    // Prime related calls
    primeContract?.getAllMarkets(),
    primeContract?.MINIMUM_STAKED_XVS(),
    accountAddress ? primeContract?.tokens(accountAddress) : undefined,
  ]);

  if (poolResults.status === 'rejected') {
    throw new Error(poolResults.reason);
  }

  if (poolParticipantsCountResult.status === 'rejected') {
    throw new Error(poolParticipantsCountResult.reason);
  }

  if (currentBlockNumberResult.status === 'rejected') {
    throw new Error(currentBlockNumberResult.reason);
  }

  // Extract token records and addresses
  const [vTokenAddresses, underlyingTokens, underlyingTokenAddresses] = poolResults.value.reduce<
    [string[], Token[], string[]]
  >(
    (acc, poolResult) => {
      const newVTokenAddresses: string[] = [];
      const newUnderlyingTokens: Token[] = [];
      const newUnderlyingTokenAddresses: string[] = [];

      poolResult.vTokens.forEach(vTokenMetaData => {
        const underlyingToken = findTokenByAddress({
          address: vTokenMetaData.underlyingAssetAddress,
          tokens,
        });

        if (!underlyingToken) {
          logError(`Record missing for underlying token: ${vTokenMetaData.underlyingAssetAddress}`);
          return;
        }

        if (!newVTokenAddresses.includes(vTokenMetaData.vToken)) {
          newVTokenAddresses.push(vTokenMetaData.vToken.toLowerCase());
        }

        if (
          !newUnderlyingTokens.some(listedUnderlyingToken =>
            areTokensEqual(listedUnderlyingToken, underlyingToken),
          )
        ) {
          newUnderlyingTokens.push(underlyingToken);
        }

        if (!newUnderlyingTokenAddresses.includes(underlyingToken.address.toLowerCase())) {
          newUnderlyingTokenAddresses.push(underlyingToken.address.toLowerCase());
        }
      });

      return [
        acc[0].concat(newVTokenAddresses),
        acc[1].concat(newUnderlyingTokens),
        acc[2].concat(newUnderlyingTokenAddresses),
      ];
    },
    [[], [], []],
  );

  // Extract Prime data
  const primeVTokenAddresses = extractSettledPromiseValue(primeVTokenAddressesResult) || [];
  const primeMinimumXvsToStakeMantissa = extractSettledPromiseValue(primeMinimumXvsToStakeResult);
  const isUserPrime = extractSettledPromiseValue(userPrimeTokenResult)?.exists || false;

  // Fetch reward distributors and addresses of user collaterals
  const getRewardDistributorsPromises: ReturnType<
    IsolatedPoolComptroller['getRewardDistributors']
  >[] = [];
  const getAssetsInPromises: ReturnType<IsolatedPoolComptroller['getAssetsIn']>[] = [];

  poolResults.value.forEach(poolResult => {
    const comptrollerContract = getIsolatedPoolComptrollerContract({
      signerOrProvider: provider,
      address: poolResult.comptroller,
    });

    getRewardDistributorsPromises.push(comptrollerContract.getRewardDistributors());

    if (accountAddress) {
      getAssetsInPromises.push(comptrollerContract.getAssetsIn(accountAddress));
    }
  });

  const settledGetRewardDistributorsPromises = Promise.allSettled(getRewardDistributorsPromises);
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

  const getRewardDistributorsResults = await settledGetRewardDistributorsPromises;
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
    isChainTimeBased: !blocksPerDay,
    provider,
    poolResults: poolResults.value,
    getRewardDistributorsResults,
  });

  // Fetch token prices
  const tokenPriceDollarsMapping = await getTokenPriceDollarsMapping({
    tokens,
    underlyingTokenAddresses,
    rewardsDistributorSettingsMapping,
    resilientOracleContract,
  });

  const pools = formatOutput({
    chainId,
    blocksPerDay,
    tokens,
    currentBlockNumber: currentBlockNumberResult.value.blockNumber,
    poolResults: poolResults.value,
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
