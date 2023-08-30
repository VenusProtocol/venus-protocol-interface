import { getIsolatedPoolParticipantsCount } from 'clients/subgraph';
import { logError } from 'context/ErrorLogger';

import { GetMainPoolInput, GetMainPoolOutput } from './types';

export type { GetMainPoolInput, GetMainPoolOutput } from './types';

// Since the borrower and supplier counts aren't essential information, we make the logic so the
// dApp can still function if the subgraph is down
const safelyGetPoolParticipantsCount = async () => {
  try {
    // TODO: query subgraph
    const res = await getIsolatedPoolParticipantsCount();
    return res;
  } catch (error) {
    logError(error);
  }
};

const getMainPool = async ({
  accountAddress,
  mainPoolComptrollerContract,
  vaiControllerContract,
  resilientOracleContract,
  provider,
}: GetMainPoolInput): Promise<GetMainPoolOutput> => {
  const promises = [
    // Fetch all markets
    mainPoolComptrollerContract.getAllMarkets(),
    // Fetch borrower and supplier counts of each asset
    // safelyGetPoolParticipantsCount(),
    // Fetch current block number
    provider.getBlockNumber(),
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
    assetsInResult,
    accrueVaiInterestResult,
    vaiRepayAmountResult,
  ] = await Promise.all(promises);

  console.log(marketsResult, currentBlockNumber);
  console.log('assetsInResult', assetsInResult);
  console.log('vaiRepayAmountResult', vaiRepayAmountResult);

  throw new Error('WIP');

  // return {
  //   pool,
  // };
};

export default getMainPool;
