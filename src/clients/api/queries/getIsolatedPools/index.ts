import { IsolatedPoolComptroller, getIsolatedPoolComptrollerContract } from 'packages/contracts';
import { logError } from 'packages/errors';
import { Token } from 'types';
import { areTokensEqual, findTokenByAddress } from 'utilities';

import { getIsolatedPoolParticipantsCount } from 'clients/subgraph';
import extractSettledPromiseValue from 'utilities/extractSettledPromiseValue';
import removeDuplicates from 'utilities/removeDuplicates';

import getBlockNumber from '../getBlockNumber';
import getTokenBalances from '../getTokenBalances';
import formatOutput from './formatOutput';
import getRewardsDistributorSettingsMapping from './getRewardsDistributorSettingsMapping';
import getTokenPriceDollarsMapping from './getTokenPriceDollarsMapping';
import { GetIsolatedPoolsInput, GetIsolatedPoolsOutput } from './types';

export type { GetIsolatedPoolsInput, GetIsolatedPoolsOutput } from './types';

// Since the borrower and supplier counts aren't essential information, we make the logic so the
// dApp can still function if the subgraph is down
const safelyGetIsolatedPoolParticipantsCount = async () => {
  try {
    const res = await getIsolatedPoolParticipantsCount();
    return res;
  } catch (error) {
    logError(error);
  }
};

const getIsolatedPools = async ({
  blocksPerDay,
  accountAddress,
  poolLensContract,
  poolRegistryContractAddress,
  resilientOracleContract,
  provider,
  tokens,
}: GetIsolatedPoolsInput): Promise<GetIsolatedPoolsOutput> => {
  const [poolResults, poolParticipantsCountResult, currentBlockNumberResult] = await Promise.all([
    // Fetch all pools
    poolLensContract.getAllPools(poolRegistryContractAddress),
    // Fetch borrower and supplier counts of each isolated token
    safelyGetIsolatedPoolParticipantsCount(),
    // Fetch current block number
    getBlockNumber({ provider }),
  ]);

  // Extract token records and addresses
  const [vTokenAddresses, underlyingTokens, underlyingTokenAddresses] = poolResults.reduce<
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

  // Fetch reward distributors and addresses of user collaterals
  const getRewardDistributorsPromises: ReturnType<
    IsolatedPoolComptroller['getRewardDistributors']
  >[] = [];
  const getAssetsInPromises: ReturnType<IsolatedPoolComptroller['getAssetsIn']>[] = [];

  poolResults.forEach(poolResult => {
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
  const settledUserPromises = Promise.allSettled([
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

  const getRewardDistributorsResults = await settledGetRewardDistributorsPromises;
  const [userVTokenBalancesAllResult, userTokenBalancesResult] = await settledUserPromises;
  const userAssetsInResults = await settledGetAssetsInPromises;

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

  // Fetch reward settings
  const rewardsDistributorSettingsMapping = await getRewardsDistributorSettingsMapping({
    provider,
    poolResults,
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
    blocksPerDay,
    tokens,
    currentBlockNumber: currentBlockNumberResult.blockNumber,
    poolResults,
    poolParticipantsCountResult,
    rewardsDistributorSettingsMapping,
    tokenPriceDollarsMapping,
    userCollateralizedVTokenAddresses,
    userVTokenBalancesAll: extractSettledPromiseValue(userVTokenBalancesAllResult),
    userTokenBalancesAll: extractSettledPromiseValue(userTokenBalancesResult),
  });

  return {
    pools,
  };
};

export default getIsolatedPools;
