import BigNumber from 'bignumber.js';

import type { PrimeApy, Token } from 'types';
import {
  appendPrimeSimulationDistributions,
  areAddressesEqual,
  convertAprBipsToApy,
  extractSettledPromiseValue,
  findTokenByAddress,
} from 'utilities';

import { getTokenBalances } from 'clients/api';
import { logError } from 'libs/errors';
import { formatToPool } from './formatToPool';
import type { GetLegacyPoolInput, GetLegacyPoolOutput } from './types';

export type { GetLegacyPoolInput, GetLegacyPoolOutput } from './types';

const getLegacyPool = async ({
  legacyPoolData,
  chainId,
  blocksPerDay,
  name,
  provider,
  description,
  xvs,
  vai,
  tokens,
  accountAddress,
  vTreasuryContractAddress,
  legacyPoolComptrollerContract,
  venusLensContract,
  vaiControllerContract,
  primeContract,
}: GetLegacyPoolInput): Promise<GetLegacyPoolOutput> => {
  const [
    primeVTokenAddressesResult,
    primeMinimumXvsToStakeResult,
    userPrimeTokenResult,
    assetsInResult,
    _accrueVaiInterestResult,
    vaiRepayAmountResult,
  ] = await Promise.allSettled([
    // Prime related calls
    primeContract?.getAllMarkets(),
    primeContract?.MINIMUM_STAKED_XVS(),
    // Account related calls
    accountAddress ? primeContract?.tokens(accountAddress) : undefined,
    accountAddress ? legacyPoolComptrollerContract.getAssetsIn(accountAddress) : undefined,
    // Call (statically) accrueVAIInterest to calculate past accrued interests before fetching all
    // interests. Since multicall will batch these requests, the call to accrueVAIInterest and
    // getVAIRepayAmount will happen in the same request (thus making the accrual possible)
    accountAddress ? vaiControllerContract.callStatic.accrueVAIInterest() : undefined,
    accountAddress ? vaiControllerContract.getVAIRepayAmount(accountAddress) : undefined,
  ]);

  const xvsMarket = legacyPoolData.markets.find(m =>
    areAddressesEqual(m.underlyingAddress || '', xvs.address),
  );
  if (!xvsMarket) {
    throw new Error('No XVS market found');
  }

  const xvsPriceMantissa = new BigNumber(xvsMarket.underlyingTokenPriceMantissa);

  const vTokenAddresses = legacyPoolData.markets.map(m => m.address);
  const primeVTokenAddresses = extractSettledPromiseValue(primeVTokenAddressesResult) || [];
  const primeMinimumXvsToStakeMantissa = extractSettledPromiseValue(primeMinimumXvsToStakeResult);
  const isUserPrime = extractSettledPromiseValue(userPrimeTokenResult)?.exists || false;

  // Fetch Prime distributions
  const primeAprPromises =
    primeContract && isUserPrime
      ? Promise.allSettled(
          accountAddress
            ? primeVTokenAddresses.map(primeVTokenAddress =>
                primeContract.calculateAPR(primeVTokenAddress, accountAddress),
              )
            : [],
        )
      : undefined;

  const primeAprResults = (await primeAprPromises) || [];

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

  const vaiRepayAmountMantissa = extractSettledPromiseValue(vaiRepayAmountResult);

  const underlyingTokens = legacyPoolData.markets.reduce<Token[]>((acc, vTokenMetaData) => {
    const underlyingToken = findTokenByAddress({
      address: vTokenMetaData.underlyingAddress,
      tokens,
    });

    if (!underlyingToken) {
      logError(`Record missing for underlying token: ${vTokenMetaData.underlyingAddress}`);
      return acc;
    }

    return [...acc, underlyingToken];
  }, []);

  // Fetch vToken meta data and user balance
  const [vTreasuryTokenBalancesResult, userVTokenBalancesResults] = await Promise.allSettled([
    // Fetch treasury balances
    getTokenBalances({
      accountAddress: vTreasuryContractAddress,
      tokens: underlyingTokens,
      provider,
    }),
    // Fetch user vToken balances
    accountAddress
      ? venusLensContract.callStatic.vTokenBalancesAll(vTokenAddresses, accountAddress)
      : undefined,
  ]);

  const pool = formatToPool({
    chainId,
    blocksPerDay,
    name,
    xvs,
    vai,
    tokens,
    description,
    comptrollerContractAddress: legacyPoolComptrollerContract.address,
    legacyPoolMarkets: legacyPoolData.markets,
    xvsPriceMantissa,
    userCollateralizedVTokenAddresses: extractSettledPromiseValue(assetsInResult),
    vTreasuryTokenBalances: extractSettledPromiseValue(vTreasuryTokenBalancesResult),
    userVTokenBalances: extractSettledPromiseValue(userVTokenBalancesResults),
    userVaiBorrowBalanceMantissa: vaiRepayAmountMantissa
      ? new BigNumber(vaiRepayAmountMantissa.toString())
      : undefined,
    primeApyMap,
  });

  // Fetch Prime simulations and add them to distributions
  if (primeContract && primeMinimumXvsToStakeMantissa) {
    await appendPrimeSimulationDistributions({
      assets: pool.assets,
      primeContract,
      primeVTokenAddresses,
      accountAddress,
      primeMinimumXvsToStakeMantissa: new BigNumber(primeMinimumXvsToStakeMantissa.toString()),
      xvs,
    });
  }

  return {
    pool,
  };
};

export default getLegacyPool;
