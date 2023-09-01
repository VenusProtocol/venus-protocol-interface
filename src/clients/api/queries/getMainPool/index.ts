import BigNumber from 'bignumber.js';

import { getIsolatedPoolParticipantsCount } from 'clients/subgraph';
import { TOKENS } from 'constants/tokens';
import { logError } from 'context/ErrorLogger';

import formatToPool from './formatToPool';
import { GetMainPoolInput, GetMainPoolOutput } from './types';

export type { GetMainPoolInput, GetMainPoolOutput } from './types';

// TODO: add tests

// Since the borrower and supplier counts aren't essential information, we make the logic so the
// dApp can still function if the subgraph is down
const safelyGetMainPoolParticipantsCount = async () => {
  try {
    // TODO: query main pool subgraph
    const res = await getIsolatedPoolParticipantsCount();
    return res;
  } catch (error) {
    logError(error);
  }
};

const getMainPool = async ({
  name,
  description,
  accountAddress,
  mainPoolComptrollerContract,
  venusLensContract,
  vaiControllerContract,
  resilientOracleContract,
}: GetMainPoolInput): Promise<GetMainPoolOutput> => {
  const [
    marketsResult,
    mainParticipantsCountResult,
    xvsPriceMantissaResult,
    assetsInResult,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    _accrueVaiInterestResult,
    vaiRepayAmountResult,
  ] = await Promise.allSettled([
    // Fetch all markets
    mainPoolComptrollerContract.getAllMarkets(),
    // Fetch borrower and supplier counts of each asset
    safelyGetMainPoolParticipantsCount(),
    // Fetch XVS price
    resilientOracleContract.getPrice(TOKENS.xvs.address),
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

  // Fetch vToken borrow and supply states
  const xvsBorrowStatePromises = Promise.allSettled(
    vTokenAddresses.map(vTokenAddress =>
      mainPoolComptrollerContract.venusBorrowState(vTokenAddress),
    ),
  );
  const xvsSupplyStatePromises = Promise.allSettled(
    vTokenAddresses.map(vTokenAddress =>
      mainPoolComptrollerContract.venusSupplyState(vTokenAddress),
    ),
  );

  // Fetch vToken meta data and user balance
  const vTokenMetaDataPromises = Promise.allSettled([
    // Fetch vToken data
    venusLensContract.callStatic.vTokenMetadataAll(vTokenAddresses),
    // Fetch use vToken balances
    accountAddress
      ? venusLensContract.callStatic.vTokenBalancesAll(vTokenAddresses, accountAddress)
      : undefined,
  ]);

  const underlyingTokenPriceResults = await underlyingTokenPricePromises;
  const borrowCapsResults = await borrowCapsPromises;
  const supplyCapsResults = await supplyCapsPromises;
  const xvsBorrowSpeedResults = await xvsBorrowSpeedPromises;
  const xvsSupplySpeedResults = await xvsSupplySpeedPromises;
  const xvsBorrowStateResults = await xvsBorrowStatePromises;
  const xvsSupplyStateResults = await xvsSupplyStatePromises;
  const [vTokenMetadataResults, userVTokenBalancesResults] = await vTokenMetaDataPromises;

  if (vTokenMetadataResults.status === 'rejected') {
    throw new Error(vTokenMetadataResults.reason);
  }

  const pool = formatToPool({
    name,
    description,
    comptrollerContractAddress: mainPoolComptrollerContract.address,
    vTokenMetadataResults: vTokenMetadataResults.value,
    underlyingTokenPriceResults,
    borrowCapsResults,
    supplyCapsResults,
    xvsBorrowSpeedResults,
    xvsSupplySpeedResults,
    xvsBorrowStateResults,
    xvsSupplyStateResults,
    xvsPriceMantissa: new BigNumber(xvsPriceMantissaResult.value.toString()),
    userCollateralizedVTokenAddresses:
      assetsInResult.status === 'fulfilled' ? assetsInResult.value : undefined,
    userVTokenBalances:
      userVTokenBalancesResults.status === 'fulfilled'
        ? userVTokenBalancesResults.value
        : undefined,
    userVaiBorrowBalanceWei:
      vaiRepayAmountResult.status === 'fulfilled' && vaiRepayAmountResult.value
        ? new BigNumber(vaiRepayAmountResult.value.toString())
        : undefined,
    mainParticipantsCountResult:
      mainParticipantsCountResult.status === 'fulfilled'
        ? mainParticipantsCountResult.value
        : undefined,
  });

  return {
    pool,
  };
};

export default getMainPool;
