import BigNumber from 'bignumber.js';

import { getIsolatedPoolParticipantsCount } from 'clients/subgraph';
import { logError } from 'context/ErrorLogger';

import formatToPool from './formatToPool';
import { GetMainPoolInput, GetMainPoolOutput, UnderlyingTokenPriceMantissas } from './types';

export type { GetMainPoolInput, GetMainPoolOutput } from './types';

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
  provider,
}: GetMainPoolInput): Promise<GetMainPoolOutput> => {
  const promises = [
    // Fetch all markets
    mainPoolComptrollerContract.getAllMarkets(),
    // Fetch current block number
    provider.getBlockNumber(),
    // Fetch borrower and supplier counts of each asset
    safelyGetMainPoolParticipantsCount(),
    // Account related calls
    accountAddress ? mainPoolComptrollerContract.getAssetsIn(accountAddress) : undefined,
    // Call (statically) accrueVAIInterest to calculate past accrued interests before fetching all
    // interests. Since wagmi will batch these requests, the call to accrueVAIInterest and
    // getVAIRepayAmount will happen in the same request (thus making the accrual possible)
    accountAddress ? vaiControllerContract.callStatic.accrueVAIInterest() : undefined,
    accountAddress ? vaiControllerContract.getVAIRepayAmount(accountAddress) : undefined,
  ] as const;

  const [
    marketsResult,
    currentBlockNumberResult,
    mainParticipantsCountResult,
    assetsInResult,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    _accrueVaiInterestResult,
    vaiRepayAmountResult,
  ] = await Promise.allSettled(promises);

  if (marketsResult.status === 'rejected') {
    throw new Error(marketsResult.reason);
  }

  if (currentBlockNumberResult.status === 'rejected') {
    throw new Error(currentBlockNumberResult.reason);
  }

  const vTokenAddresses = marketsResult.value;

  const [vTokenMetadataResults, userVTokenBalancesResults, ...underlyingTokenPricesResults] =
    await Promise.allSettled([
      // Fetch vToken data
      venusLensContract.callStatic.vTokenMetadataAll(vTokenAddresses),
      // Fetch use vToken balances
      accountAddress
        ? venusLensContract.callStatic.vTokenBalancesAll(vTokenAddresses, accountAddress)
        : undefined,
      // Fetch underlying token prices
      ...vTokenAddresses.map(vTokenAddress =>
        resilientOracleContract.getUnderlyingPrice(vTokenAddress),
      ),
    ]);

  if (vTokenMetadataResults.status === 'rejected') {
    throw new Error(vTokenMetadataResults.reason);
  }

  const underlyingTokenPriceMantissas =
    underlyingTokenPricesResults.reduce<UnderlyingTokenPriceMantissas>(
      (underlyingTokenPriceMantissasAcc, underlyingTokenPricesResult, index) => ({
        ...underlyingTokenPriceMantissasAcc,
        [vTokenAddresses[index]]:
          underlyingTokenPricesResult.status === 'fulfilled'
            ? new BigNumber(underlyingTokenPricesResult.value.toString())
            : undefined,
      }),
      {},
    );

  const pool = formatToPool({
    name,
    description,
    comptrollerContractAddress: mainPoolComptrollerContract.address,
    vTokenAddresses,
    vTokenMetadataResults: vTokenMetadataResults.value,
    currentBlockNumber: currentBlockNumberResult.value,
    underlyingTokenPriceMantissas,
    assetsInResult: assetsInResult.status === 'fulfilled' ? assetsInResult.value : undefined,
    userVTokenBalancesResults:
      userVTokenBalancesResults.status === 'fulfilled'
        ? userVTokenBalancesResults.value
        : undefined,
    vaiRepayAmountResult:
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
