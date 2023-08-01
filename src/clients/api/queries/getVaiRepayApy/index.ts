import BigNumber from 'bignumber.js';
import { ContractTypeByName } from 'packages/contracts';
import { calculateApy, multiplyMantissaDaily } from 'utilities';

export interface GetVaiRepayApyInput {
  vaiControllerContract: ContractTypeByName<'vaiController'>;
}

export interface GetVaiRepayApyOutput {
  repayApyPercentage: BigNumber;
}

const getVaiRepayApy = async ({
  vaiControllerContract,
}: GetVaiRepayApyInput): Promise<GetVaiRepayApyOutput> => {
  const vaiRepayRatePerBlockMantissa = await vaiControllerContract.getVAIRepayRatePerBlock();

  const vaiDailyPercentageRate = multiplyMantissaDaily({
    mantissa: vaiRepayRatePerBlockMantissa.toString(),
  });

  const apyPercentage = calculateApy({
    dailyRate: vaiDailyPercentageRate,
  });

  return {
    repayApyPercentage: apyPercentage,
  };
};

export default getVaiRepayApy;
