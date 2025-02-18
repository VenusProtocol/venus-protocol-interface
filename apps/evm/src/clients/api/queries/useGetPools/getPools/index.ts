import BigNumber from 'bignumber.js';
import { getUserVaiBorrowBalance } from 'clients/api';
import type { GetIsolatedPoolParticipantsCountInput } from 'clients/subgraph';
import { primeAbi } from 'libs/contracts';
import { logError } from 'libs/errors';
import type { Asset, TokenBalance } from 'types';
import type { GetPoolsInput, GetPoolsOutput, PrimeApy, VTokenBalance } from '../types';
import { appendPrimeSimulationDistributions } from './appendPrimeSimulationDistributions';
import { formatOutput } from './formatOutput';
import { getApiPools } from './getApiPools';
import { getIsolatedPoolParticipantCounts } from './getIsolatedPoolParticipantCounts';
import { getUserCollateralAddresses } from './getUserCollateralAddresses';
import { getUserPrimeApys } from './getUserPrimeApys';
import { getUserTokenBalances } from './getUserTokenBalances';

const safeGetIsolatedPoolParticipantCount = async (
  input: GetIsolatedPoolParticipantsCountInput,
) => {
  try {
    const result = await getIsolatedPoolParticipantCounts(input);
    return result;
  } catch (error) {
    // Safari throws a "TypeError: Load failed" error if the fetch is canceled
    // e.g., if the user navigates away from the page before the request is finished
    // we can safely filter them out from being logged
    if (error instanceof Error && error.name === 'TypeError' && error.message === 'Load failed') {
      return undefined;
    }
    // Log error without throwing to prevent the entire query from failing, since this relies on a
    // third-party service that could be down and doesn't constitute a critical failure
    logError(error);
  }
};

export const getPools = async ({
  publicClient,
  chainId,
  accountAddress,
  primeContractAddress,
  poolLensContractAddress,
  legacyPoolComptrollerContractAddress,
  vaiControllerContractAddress,
  venusLensContractAddress,
  tokens,
}: GetPoolsInput) => {
  const [
    { pools: apiPools },
    isolatedPoolParticipantCounts,
    currentBlockNumber,
    unsafePrimeVTokenAddresses,
    primeMinimumXvsToStakeMantissa,
    userPrimeToken,
  ] = await Promise.all([
    getApiPools({ chainId }),
    safeGetIsolatedPoolParticipantCount({ chainId }),
    // Fetch current block number
    publicClient.getBlockNumber(),
    // Prime related calls
    primeContractAddress
      ? publicClient.readContract({
          abi: primeAbi,
          address: primeContractAddress,
          functionName: 'getAllMarkets',
        }) // TODO: get from API
      : undefined,
    primeContractAddress
      ? publicClient.readContract({
          abi: primeAbi,
          address: primeContractAddress,
          functionName: 'MINIMUM_STAKED_XVS',
        }) // TODO: get from API
      : undefined,
    accountAddress && primeContractAddress
      ? publicClient.readContract({
          abi: primeAbi,
          address: primeContractAddress,
          functionName: 'tokens',
          args: [accountAddress],
        })
      : undefined,
  ]);

  const primeVTokenAddresses = unsafePrimeVTokenAddresses ?? [];
  const isUserPrime = userPrimeToken?.[0] || false;

  let userCollateralVTokenAddresses: string[] | undefined;
  let userTokenBalances: TokenBalance[] | undefined;
  let userVTokenBalances: VTokenBalance[] | undefined;
  let userVaiBorrowBalanceMantissa: BigNumber | undefined;
  let userPrimeApyMap: Map<string, PrimeApy> | undefined;

  if (accountAddress) {
    const [userCollaterals, userBalances, userVaiBorrowBalance, userPrimeApys] = await Promise.all([
      getUserCollateralAddresses({
        chainId,
        accountAddress,
        legacyPoolComptrollerContractAddress,
        apiPools,
        publicClient,
      }),
      getUserTokenBalances({
        accountAddress,
        apiPools,
        chainId,
        tokens,
        publicClient,
        poolLensContractAddress,
        venusLensContractAddress,
      }),
      vaiControllerContractAddress
        ? getUserVaiBorrowBalance({
            accountAddress,
            publicClient,
            vaiControllerContractAddress,
          })
        : undefined,
      isUserPrime && primeContractAddress
        ? getUserPrimeApys({
            accountAddress,
            publicClient,
            primeContractAddress,
            primeVTokenAddresses,
          })
        : undefined,
    ]);

    userCollateralVTokenAddresses = userCollaterals.userCollateralAddresses;
    userVTokenBalances = userBalances.userVTokenBalances;
    userTokenBalances = userBalances.userTokenBalances;
    userVaiBorrowBalanceMantissa = userVaiBorrowBalance?.userVaiBorrowBalanceMantissa;
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
  if (primeContractAddress && primeMinimumXvsToStakeMantissa && xvs) {
    await appendPrimeSimulationDistributions({
      assets: pools.reduce<Asset[]>((acc, pool) => acc.concat(pool.assets), []),
      primeContractAddress,
      primeVTokenAddresses,
      primeMinimumXvsToStakeMantissa: new BigNumber(primeMinimumXvsToStakeMantissa.toString()),
      xvs,
      chainId,
      publicClient,
    });
  }

  const output: GetPoolsOutput = {
    pools,
  };

  return output;
};
