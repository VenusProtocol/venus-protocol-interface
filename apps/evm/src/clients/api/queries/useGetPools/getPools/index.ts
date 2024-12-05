import BigNumber from 'bignumber.js';

import { getBlockNumber, getTokenBalances } from 'clients/api';
import { NATIVE_TOKEN_ADDRESS } from 'constants/address';
import {
  type IsolatedPoolComptroller,
  type LegacyPoolComptroller,
  type PoolLens,
  type Prime,
  type VaiController,
  type VenusLens,
  getIsolatedPoolComptrollerContract,
} from 'libs/contracts';
import type { Provider } from 'libs/wallet';
import type { Asset, ChainId, Pool, PrimeApy, Token } from 'types';
import {
  appendPrimeSimulationDistributions,
  convertAprBipsToApy,
  extractSettledPromiseValue,
  findTokenByAddress,
} from 'utilities';
import removeDuplicates from 'utilities/removeDuplicates';

import { formatOutput } from './formatOutput';
import { getApiPools } from './getApiPools';

export interface GetPoolsInput {
  chainId: ChainId;
  tokens: Token[];
  provider: Provider;
  poolLensContract: PoolLens;
  legacyPoolComptrollerContract?: LegacyPoolComptroller;
  venusLensContract?: VenusLens;
  vaiControllerContract?: VaiController;
  accountAddress?: string;
  blocksPerDay?: number;
  primeContract?: Prime;
}

export interface GetPoolsOutput {
  pools: Pool[];
  primeVTokenAddresses: string[];
}

export const getPools = async ({
  chainId,
  accountAddress,
  blocksPerDay,
  primeContract,
  poolLensContract,
  legacyPoolComptrollerContract,
  vaiControllerContract,
  venusLensContract,
  provider,
  tokens,
}: GetPoolsInput) => {
  const [
    apiPoolsResult,
    currentBlockNumberResult,
    primeVTokenAddressesResult,
    primeMinimumXvsToStakeResult,
    userPrimeTokenResult,
    _accrueVaiInterestResult,
    vaiRepayAmountResult,
  ] = await Promise.allSettled([
    getApiPools({ chainId }),
    // Fetch current block number
    getBlockNumber({ provider }),
    // Prime related calls
    primeContract?.getAllMarkets(), // TODO: get from API
    primeContract?.MINIMUM_STAKED_XVS(), // TODO: get from API
    accountAddress ? primeContract?.tokens(accountAddress) : undefined,
    // Call (statically) accrueVAIInterest to calculate past accrued interests before fetching all
    // interests. Since multicall will batch these requests, the call to accrueVAIInterest and
    // getVAIRepayAmount will happen in the same request (thus making the accrual possible)
    accountAddress && vaiControllerContract
      ? vaiControllerContract.callStatic.accrueVAIInterest()
      : undefined,
    accountAddress && vaiControllerContract
      ? vaiControllerContract.getVAIRepayAmount(accountAddress)
      : undefined,
  ]);

  if (apiPoolsResult.status === 'rejected') {
    throw new Error(apiPoolsResult.reason);
  }

  if (currentBlockNumberResult.status === 'rejected') {
    throw new Error(currentBlockNumberResult.reason);
  }

  const apiPools = apiPoolsResult.value.pools;
  const primeMinimumXvsToStakeValue = extractSettledPromiseValue(primeMinimumXvsToStakeResult);
  const primeMinimumXvsToStakeMantissa =
    primeMinimumXvsToStakeValue && new BigNumber(primeMinimumXvsToStakeValue.toString());

  // Extract token records and addresses
  const [legacyPoolVTokenAddresses, isolatedPoolsVTokenAddresses, underlyingTokens] =
    apiPools.reduce<[string[], string[], Token[]]>(
      (acc, pool) => {
        const newLegacyPoolVTokenAddresses: string[] = [];
        const newIsolatedPoolsVTokenAddresses: string[] = [];
        const newUnderlyingTokens: Token[] = [];
        const newUnderlyingTokenAddresses: string[] = [];

        pool.markets.forEach(market => {
          // VToken addresses are unique
          if (pool.isIsolated) {
            newIsolatedPoolsVTokenAddresses.push(market.address.toLowerCase());
          } else {
            newLegacyPoolVTokenAddresses.push(market.address.toLowerCase());
          }

          const underlyingToken = findTokenByAddress({
            address: market.underlyingAddress || NATIVE_TOKEN_ADDRESS,
            tokens,
          });

          if (
            underlyingToken &&
            !newUnderlyingTokenAddresses.includes(underlyingToken.address.toLowerCase())
          ) {
            newUnderlyingTokens.push(underlyingToken);
            newUnderlyingTokenAddresses.push(underlyingToken.address.toLowerCase());
          }
        });

        return [
          acc[0].concat(newLegacyPoolVTokenAddresses),
          acc[1].concat(newIsolatedPoolsVTokenAddresses),
          acc[2].concat(newUnderlyingTokens),
        ];
      },
      [[], [], []],
    );

  // Fetch addresses of user collaterals
  const getAssetsInPromises: ReturnType<IsolatedPoolComptroller['getAssetsIn']>[] = [];
  apiPools.forEach(pool => {
    const comptrollerContract = getIsolatedPoolComptrollerContract({
      signerOrProvider: provider,
      address: pool.address,
    });

    if (accountAddress) {
      getAssetsInPromises.push(comptrollerContract.getAssetsIn(accountAddress));
    }
  });
  const settledGetAssetsInPromises = Promise.allSettled(getAssetsInPromises);

  if (accountAddress && legacyPoolComptrollerContract) {
    getAssetsInPromises.push(legacyPoolComptrollerContract.getAssetsIn(accountAddress));
  }

  // Fetch user token balances
  const tokenBalancesPromises = Promise.allSettled([
    accountAddress
      ? poolLensContract.callStatic.vTokenBalancesAll(isolatedPoolsVTokenAddresses, accountAddress)
      : undefined,
    accountAddress && venusLensContract
      ? venusLensContract.callStatic.vTokenBalancesAll(legacyPoolVTokenAddresses, accountAddress)
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
  const primeVTokenAddresses = extractSettledPromiseValue(primeVTokenAddressesResult) || [];
  const isUserPrime = extractSettledPromiseValue(userPrimeTokenResult)?.exists || false;
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

  const [
    userIsolatedPoolVTokenBalancesResult,
    userLegacyPoolVTokenBalancesResult,
    userTokenBalancesResult,
  ] = await tokenBalancesPromises;
  const userAssetsInResults = await settledGetAssetsInPromises;
  const primeAprResults = (await settledPrimeAprPromises) || [];

  // Log errors without throwing so that assets can still be displayed
  if (userIsolatedPoolVTokenBalancesResult?.status === 'rejected') {
    throw new Error(userIsolatedPoolVTokenBalancesResult.reason);
  }

  if (userLegacyPoolVTokenBalancesResult?.status === 'rejected') {
    throw new Error(userLegacyPoolVTokenBalancesResult.reason);
  }

  if (userTokenBalancesResult?.status === 'rejected') {
    throw new Error(userTokenBalancesResult.reason);
  }

  // Extract user vToken balances
  const userIsolatedPoolVTokenBalances = extractSettledPromiseValue(
    userIsolatedPoolVTokenBalancesResult,
  );
  const userLegacyPoolVTokenBalances = extractSettledPromiseValue(
    userLegacyPoolVTokenBalancesResult,
  );
  const userVTokenBalances = [
    ...(userIsolatedPoolVTokenBalances || []),
    ...(userLegacyPoolVTokenBalances || []),
  ];

  // Extract addresses of user collaterals
  const userCollateralizedVTokenAddresses = removeDuplicates(
    userAssetsInResults.reduce<string[]>((acc, userAssetsInResult) => {
      if (userAssetsInResult.status === 'rejected') {
        throw new Error(userAssetsInResult.reason);
      }

      return acc.concat(userAssetsInResult.value);
    }, []),
  );

  // Extract Prime APYs
  const primeApyMap = new Map<string, PrimeApy>();
  primeAprResults.forEach((primeAprResult, index) => {
    if (primeAprResult.status === 'rejected') {
      throw new Error(primeAprResult.reason);
    }

    const primeApr = primeAprResult.value;

    const apys: PrimeApy = {
      borrowApy: convertAprBipsToApy({ aprBips: primeApr?.borrowAPR.toString() || '0' }),
      supplyApy: convertAprBipsToApy({ aprBips: primeApr?.supplyAPR.toString() || '0' }),
    };

    primeApyMap.set(primeVTokenAddresses[index], apys);
  });

  const vaiRepayAmountMantissa = extractSettledPromiseValue(vaiRepayAmountResult);

  const pools = formatOutput({
    chainId,
    blocksPerDay,
    tokens,
    currentBlockNumber: currentBlockNumberResult.value.blockNumber,
    apiPools: apiPoolsResult.value.pools,
    userCollateralizedVTokenAddresses,
    userVTokenBalances,
    userTokenBalances: extractSettledPromiseValue(userTokenBalancesResult)?.tokenBalances,
    userVaiBorrowBalanceMantissa: vaiRepayAmountMantissa
      ? new BigNumber(vaiRepayAmountMantissa.toString())
      : undefined,
    primeApyMap,
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
    primeVTokenAddresses,
  };

  return output;
};
