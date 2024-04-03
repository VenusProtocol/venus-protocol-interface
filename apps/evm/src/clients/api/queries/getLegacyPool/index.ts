import BigNumber from 'bignumber.js';

import type { PrimeApy } from 'types';
import {
  appendPrimeSimulationDistributions,
  areAddressesEqual,
  convertAprToApy,
  extractSettledPromiseValue,
} from 'utilities';

import getLegacyPoolMarkets from '../getLegacyPoolMarkets';
import { formatToPool } from './formatToPool';
import type { GetLegacyPoolInput, GetLegacyPoolOutput } from './types';

export type { GetLegacyPoolInput, GetLegacyPoolOutput } from './types';

const getLegacyPool = async ({
  chainId,
  blocksPerDay,
  name,
  description,
  xvs,
  vai,
  tokens,
  accountAddress,
  legacyPoolComptrollerContract,
  venusLensContract,
  vaiControllerContract,
  primeContract,
}: GetLegacyPoolInput): Promise<GetLegacyPoolOutput> => {
  const [
    marketsResult,
    primeVTokenAddressesResult,
    primeMinimumXvsToStakeResult,
    userPrimeTokenResult,
    assetsInResult,
    _accrueVaiInterestResult,
    vaiRepayAmountResult,
  ] = await Promise.allSettled([
    // Fetch market data from the API
    // TODO: fetch borrower and supplier counts from subgraph once available
    getLegacyPoolMarkets({ xvs }),
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

  if (marketsResult.status === 'rejected') {
    throw new Error(marketsResult.reason);
  }

  const markets = marketsResult.value.markets;
  const xvsPriceMantissaResult = markets.find(market =>
    areAddressesEqual(xvs.address, market.underlyingAddress),
  );

  if (!xvsPriceMantissaResult) {
    throw new Error('No XVS price found');
  }
  const vTokenAddresses = markets.map(market => market.address);
  const primeVTokenAddresses = extractSettledPromiseValue(primeVTokenAddressesResult) || [];
  const primeMinimumXvsToStakeMantissa = extractSettledPromiseValue(primeMinimumXvsToStakeResult);
  const isUserPrime = extractSettledPromiseValue(userPrimeTokenResult)?.exists || false;

  // Fetch vToken borrow and supply speeds
  const xvsBorrowSpeedPromises = Promise.allSettled(
    vTokenAddresses.map(vTokenAddress =>
      legacyPoolComptrollerContract.venusBorrowSpeeds(vTokenAddress),
    ),
  );
  const xvsSupplySpeedPromises = Promise.allSettled(
    vTokenAddresses.map(vTokenAddress =>
      legacyPoolComptrollerContract.venusSupplySpeeds(vTokenAddress),
    ),
  );

  // Fetch vToken meta data and user balance
  const vTokenMetaDataPromises = Promise.allSettled([
    // Fetch user vToken balances
    accountAddress
      ? venusLensContract.callStatic.vTokenBalancesAll(vTokenAddresses, accountAddress)
      : undefined,
  ]);

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

  const xvsBorrowSpeedResults = await xvsBorrowSpeedPromises;
  const xvsSupplySpeedResults = await xvsSupplySpeedPromises;
  const [userVTokenBalancesResults] = await vTokenMetaDataPromises;
  const primeAprResults = (await primeAprPromises) || [];

  const primeApyMap = new Map<string, PrimeApy>();
  primeAprResults.forEach((primeAprResult, index) => {
    if (primeAprResult.status !== 'fulfilled') {
      return;
    }

    const primeApr = primeAprResult.value;

    const apys: PrimeApy = {
      borrowApy: convertAprToApy({ aprBips: primeApr?.borrowAPR.toString() || '0' }),
      supplyApy: convertAprToApy({ aprBips: primeApr?.supplyAPR.toString() || '0' }),
    };

    primeApyMap.set(primeVTokenAddresses[index], apys);
  });

  const vaiRepayAmountMantissa = extractSettledPromiseValue(vaiRepayAmountResult);

  const pool = formatToPool({
    chainId,
    blocksPerDay,
    name,
    xvs,
    vai,
    tokens,
    description,
    comptrollerContractAddress: legacyPoolComptrollerContract.address,
    xvsBorrowSpeedResults,
    xvsSupplySpeedResults,
    xvsPriceMantissa: new BigNumber(xvsPriceMantissaResult.underlyingTokenPriceMantissa),
    userCollateralizedVTokenAddresses: extractSettledPromiseValue(assetsInResult),
    userVTokenBalances: extractSettledPromiseValue(userVTokenBalancesResults),
    userVaiBorrowBalanceMantissa: vaiRepayAmountMantissa
      ? new BigNumber(vaiRepayAmountMantissa.toString())
      : undefined,
    primeApyMap,
    mainMarkets: markets,
  });

  // Fetch Prime simulations and add them to distributions
  // if a user is connected, fetch their specific Prime APYs
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
