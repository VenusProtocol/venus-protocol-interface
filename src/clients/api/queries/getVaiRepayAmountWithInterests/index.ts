import BigNumber from 'bignumber.js';

import { GetVaiRepayAmountWithInterestsInput, GetVaiRepayAmountWithInterestsOutput } from './types';

const getVaiRepayAmountWithInterests = async ({
  vaiControllerContract,
  accountAddress,
}: GetVaiRepayAmountWithInterestsInput): Promise<GetVaiRepayAmountWithInterestsOutput> => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [_accrueVaiInterestResult, getVaiRepayAmountResult] = await Promise.all([
    // Call (statically) accrueVAIInterest to calculate past accrued interests before fetching all
    // interests
    vaiControllerContract.callStatic.accrueVAIInterest(),
    vaiControllerContract.getVAIRepayAmount(accountAddress),
  ]);

  return {
    vaiRepayAmountWithInterestsWei: new BigNumber(getVaiRepayAmountResult.toString()),
  };
};

export default getVaiRepayAmountWithInterests;
