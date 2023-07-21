import BigNumber from 'bignumber.js';
import { calculateApy, calculateDailyDistributedTokens } from 'utilities';

import { VaiController } from 'types/contracts';

export interface GetVaiRepayApyInput {
  vaiControllerContract: VaiController;
}

export interface GetVaiRepayApyOutput {
  repayApyPercentage: BigNumber;
}

const getVaiRepayApy = async ({
  vaiControllerContract,
}: GetVaiRepayApyInput): Promise<GetVaiRepayApyOutput> => {
  const vaiRepayRatePerBlockMantissa = await vaiControllerContract.getVAIRepayRatePerBlock();

  const vaiDailyPercentageRate = calculateDailyDistributedTokens({
    mantissa: vaiRepayRatePerBlockMantissa.toString(),
  });

  const apyPercentage = calculateApy({
    dailyDistributedTokens: vaiDailyPercentageRate,
  });

  return {
    repayApyPercentage: apyPercentage,
  };
};

export default getVaiRepayApy;
