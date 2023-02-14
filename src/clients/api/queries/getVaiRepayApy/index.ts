import BigNumber from 'bignumber.js';

import { VaiController } from 'types/contracts';
import calculateApy from 'utilities/calculateApy';

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

  const { apyPercentage } = calculateApy(vaiRepayRatePerBlockMantissa.toString());

  return {
    repayApyPercentage: apyPercentage,
  };
};

export default getVaiRepayApy;
