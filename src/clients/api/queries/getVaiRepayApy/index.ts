import BigNumber from 'bignumber.js';
import { VaiController } from 'packages/contracts';
import { calculateApy, multiplyMantissaDaily } from 'utilities';

export interface GetVaiRepayApyInput {
  vaiControllerContract: VaiController;
  blocksPerDay: number;
}

export interface GetVaiRepayApyOutput {
  repayApyPercentage: BigNumber;
}

const getVaiRepayApy = async ({
  vaiControllerContract,
  blocksPerDay,
}: GetVaiRepayApyInput): Promise<GetVaiRepayApyOutput> => {
  const vaiRepayRatePerBlockMantissa = await vaiControllerContract.getVAIRepayRatePerBlock();

  const vaiDailyPercentageRate = multiplyMantissaDaily({
    mantissa: vaiRepayRatePerBlockMantissa.toString(),
    blocksPerDay,
  });

  const apyPercentage = calculateApy({
    dailyRate: vaiDailyPercentageRate,
  });

  return {
    repayApyPercentage: apyPercentage,
  };
};

export default getVaiRepayApy;
