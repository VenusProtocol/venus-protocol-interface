import BigNumber from 'bignumber.js';
import { logError } from 'errors';

import extractSettledPromiseValue from 'utilities/extractSettledPromiseValue';

import getMainMarkets from '../getMainMarkets';
import formatToPool from './formatToPool';
import { GetMainPoolInput, GetMainPoolOutput } from './types';

export type { GetMainPoolInput, GetMainPoolOutput } from './types';

// Since the borrower and supplier counts aren't essential information, we make the logic so the
// dApp can still function if the API is down
const safelyGetMainMarkets = async () => {
  try {
    const res = await getMainMarkets();
    return res;
  } catch (error) {
    logError(error);
  }
};

const getMainPool = async ({
  name,
  description,
  xvs,
  vai,
  tokens,
  accountAddress,
  mainPoolComptrollerContract,
  venusLensContract,
  vaiControllerContract,
  resilientOracleContract,
}: GetMainPoolInput): Promise<GetMainPoolOutput> => {
  const [
    marketsResult,
    mainMarkets,
    xvsPriceMantissaResult,
    assetsInResult,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    _accrueVaiInterestResult,
    vaiRepayAmountResult,
  ] = await Promise.allSettled([
    // Fetch all markets
    mainPoolComptrollerContract.getAllMarkets(),
    // Fetch main markets to get the supplier and borrower counts
    // TODO: fetch borrower and supplier counts from subgraph once available
    safelyGetMainMarkets(),
    // Fetch XVS price
    resilientOracleContract.getPrice(xvs.address),
    // Account related calls
    accountAddress ? mainPoolComptrollerContract.getAssetsIn(accountAddress) : undefined,
    // Call (statically) accrueVAIInterest to calculate past accrued interests before fetching all
    // interests. Since multicall will batch these requests, the call to accrueVAIInterest and
    // getVAIRepayAmount will happen in the same request (thus making the accrual possible)
    accountAddress ? vaiControllerContract.callStatic.accrueVAIInterest() : undefined,
    accountAddress ? vaiControllerContract.getVAIRepayAmount(accountAddress) : undefined,
  ]);

  if (marketsResult.status === 'rejected') {
    throw new Error(marketsResult.reason);
  }

  if (xvsPriceMantissaResult.status === 'rejected') {
    throw new Error(xvsPriceMantissaResult.reason);
  }

  const vTokenAddresses = marketsResult.value;

  // Fetch underlying token prices
  const underlyingTokenPricePromises = Promise.allSettled(
    vTokenAddresses.map(vTokenAddress => resilientOracleContract.getUnderlyingPrice(vTokenAddress)),
  );

  // Fetch vToken borrow and supply caps
  const borrowCapsPromises = Promise.allSettled(
    vTokenAddresses.map(vTokenAddress => mainPoolComptrollerContract.borrowCaps(vTokenAddress)),
  );
  const supplyCapsPromises = Promise.allSettled(
    vTokenAddresses.map(vTokenAddress => mainPoolComptrollerContract.supplyCaps(vTokenAddress)),
  );

  // Fetch vToken borrow and supply speeds
  const xvsBorrowSpeedPromises = Promise.allSettled(
    vTokenAddresses.map(vTokenAddress =>
      mainPoolComptrollerContract.venusBorrowSpeeds(vTokenAddress),
    ),
  );
  const xvsSupplySpeedPromises = Promise.allSettled(
    vTokenAddresses.map(vTokenAddress =>
      mainPoolComptrollerContract.venusSupplySpeeds(vTokenAddress),
    ),
  );

  // Fetch vToken meta data and user balance
  const vTokenMetaDataPromises = Promise.allSettled([
    // Fetch vToken data
    venusLensContract.callStatic.vTokenMetadataAll(vTokenAddresses),
    // Fetch user vToken balances
    accountAddress
      ? venusLensContract.callStatic.vTokenBalancesAll(vTokenAddresses, accountAddress)
      : undefined,
  ]);

  const underlyingTokenPriceResults = await underlyingTokenPricePromises;
  const borrowCapsResults = await borrowCapsPromises;
  const supplyCapsResults = await supplyCapsPromises;
  const xvsBorrowSpeedResults = await xvsBorrowSpeedPromises;
  const xvsSupplySpeedResults = await xvsSupplySpeedPromises;
  const [vTokenMetaDataResults, userVTokenBalancesResults] = await vTokenMetaDataPromises;

  if (vTokenMetaDataResults.status === 'rejected') {
    throw new Error(vTokenMetaDataResults.reason);
  }

  const vaiRepayAmountMantissa = extractSettledPromiseValue(vaiRepayAmountResult);

  const pool = formatToPool({
    name,
    xvs,
    vai,
    tokens,
    description,
    comptrollerContractAddress: mainPoolComptrollerContract.address,
    vTokenMetaDataResults: vTokenMetaDataResults.value,
    underlyingTokenPriceResults,
    borrowCapsResults,
    supplyCapsResults,
    xvsBorrowSpeedResults,
    xvsSupplySpeedResults,
    xvsPriceMantissa: new BigNumber(xvsPriceMantissaResult.value.toString()),
    userCollateralizedVTokenAddresses: extractSettledPromiseValue(assetsInResult),
    userVTokenBalances: extractSettledPromiseValue(userVTokenBalancesResults),
    userVaiBorrowBalanceWei: vaiRepayAmountMantissa
      ? new BigNumber(vaiRepayAmountMantissa.toString())
      : undefined,
    mainMarkets: extractSettledPromiseValue(mainMarkets)?.markets,
  });

  return {
    pool,
  };
};

export default getMainPool;
