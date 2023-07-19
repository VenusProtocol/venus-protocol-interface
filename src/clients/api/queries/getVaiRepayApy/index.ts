import BigNumber from 'bignumber.js';
import { calculateApy, calculateDailyDistributedTokens } from 'utilities';

import { TOKENS } from 'constants/tokens';
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

  const dailyVaiDistributedTokens = calculateDailyDistributedTokens({
    ratePerBlockMantissa: vaiRepayRatePerBlockMantissa.toString(),
    decimals: TOKENS.vai.decimals,
  });

  const apyPercentage = calculateApy({
    dailyDistributedTokens: dailyVaiDistributedTokens,
    decimals: TOKENS.vai.decimals,
  });

  return {
    repayApyPercentage: apyPercentage,
  };
};

export default getVaiRepayApy;
