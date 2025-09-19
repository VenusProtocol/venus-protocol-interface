import BigNumber from 'bignumber.js';
import type { Address } from 'viem';

import { getUserVaiBorrowBalance } from 'clients/api';
import { legacyPoolComptrollerAbi, primeAbi } from 'libs/contracts';
import type { Asset, TokenBalance } from 'types';
import type { GetPoolsInput, GetPoolsOutput, PrimeApy, VTokenBalance } from '../types';
import { appendPrimeSimulationDistributions } from './appendPrimeSimulationDistributions';
import { formatOutput } from './formatOutput';
import { getApiPools } from './getApiPools';
import { getUserCollateralAddresses } from './getUserCollateralAddresses';
import { getUserPrimeApys } from './getUserPrimeApys';
import { getUserTokenBalances } from './getUserTokenBalances';

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
  isEModeFeatureEnabled,
}: GetPoolsInput) => {
  const [
    { pools: apiPools, tokenPricesMapping },
    currentBlockNumber,
    unsafePrimeVTokenAddresses,
    primeMinimumXvsToStakeMantissa,
    userPrimeToken,
  ] = await Promise.all([
    getApiPools({ chainId }),
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
  let userLegacyPoolEModeGroupId: number | undefined;

  if (accountAddress) {
    const [
      userCollaterals,
      userBalances,
      userVaiBorrowBalance,
      userPrimeApys,
      userLegacyPoolEModeGroupIdResult,
    ] = await Promise.all([
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
      isEModeFeatureEnabled && legacyPoolComptrollerContractAddress
        ? publicClient.readContract({
            abi: legacyPoolComptrollerAbi,
            address: legacyPoolComptrollerContractAddress,
            functionName: 'userPoolId',
            args: [accountAddress],
          })
        : undefined,
    ]);

    userCollateralVTokenAddresses = userCollaterals.userCollateralAddresses;
    userVTokenBalances = userBalances.userVTokenBalances;
    userTokenBalances = userBalances.userTokenBalances;
    userVaiBorrowBalanceMantissa = userVaiBorrowBalance?.userVaiBorrowBalanceMantissa;
    userPrimeApyMap = userPrimeApys?.userPrimeApyMap;
    userLegacyPoolEModeGroupId = userLegacyPoolEModeGroupIdResult
      ? Number(userLegacyPoolEModeGroupIdResult)
      : undefined;
  }

  const userPoolEModeGroupIdMapping: Record<Address, number> = {};

  // E-mode groups are currently only enabled on the legacy Core Pool
  if (userLegacyPoolEModeGroupId && legacyPoolComptrollerContractAddress) {
    userPoolEModeGroupIdMapping[legacyPoolComptrollerContractAddress.toLowerCase() as Address] =
      userLegacyPoolEModeGroupId;
  }

  const pools = formatOutput({
    chainId,
    tokens,
    currentBlockNumber,
    apiPools,
    tokenPricesMapping,
    userPrimeApyMap,
    userCollateralVTokenAddresses,
    userVTokenBalances,
    userTokenBalances,
    userVaiBorrowBalanceMantissa,
    isEModeFeatureEnabled,
    userPoolEModeGroupIdMapping,
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
