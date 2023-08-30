import { getGenericContract } from 'packages/contracts';

import { getIsolatedPoolParticipantsCount } from 'clients/subgraph';
import { TOKENS } from 'constants/tokens';
import { logError } from 'context/ErrorLogger';

import { GetMainPoolInput, GetMainPoolOutput } from './types';

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
    currentBlockNumber,
    mainParticipantsCountResult,
    assetsInResult,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    _accrueVaiInterestResult,
    vaiRepayAmountResult,
  ] = await Promise.allSettled(promises);

  if (marketsResult.status === 'rejected') {
    throw new Error(marketsResult.reason);
  }

  if (currentBlockNumber.status === 'rejected') {
    throw new Error(currentBlockNumber.reason);
  }

  const vTokenAddresses = marketsResult.value;

  const [vTokenData, ...tokenPricesResults] = await Promise.allSettled([
    // Fetch vToken data
    venusLensContract.callStatic.vTokenMetadataAll(vTokenAddresses),
    // Fetch underlying token prices
    ...vTokenAddresses.map(vTokenAddress =>
      resilientOracleContract.getUnderlyingPrice(vTokenAddress),
    ),
  ]);

  if (vTokenData.status === 'rejected') {
    throw new Error(vTokenData.reason);
  }

  // TODO: shape main pool and its assets

  throw new Error('WIP');

  // return {
  //   pool,
  // };
};

export default getMainPool;
