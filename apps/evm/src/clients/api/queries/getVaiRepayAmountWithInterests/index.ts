import BigNumber from 'bignumber.js';

import type {
  GetVaiRepayAmountWithInterestsInput,
  GetVaiRepayAmountWithInterestsOutput,
} from './types';

const getVaiRepayAmountWithInterests = async ({
  vaiControllerContract,
  accountAddress,
}: GetVaiRepayAmountWithInterestsInput): Promise<GetVaiRepayAmountWithInterestsOutput> => {
  const [_accrueVaiInterestResult, getVaiRepayAmountResult] = await Promise.all([
    // Call (statically) accrueVAIInterest to calculate past accrued interests before fetching all
    // interests
    vaiControllerContract.callStatic.accrueVAIInterest(),
    vaiControllerContract.getVAIRepayAmount(accountAddress),
  ]);

  return {
    vaiRepayAmountWithInterestsMantissa: new BigNumber(getVaiRepayAmountResult.toString()),
  };
};

export default getVaiRepayAmountWithInterests;
