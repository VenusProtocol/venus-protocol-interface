import BigNumber from 'bignumber.js';

import type { VaiController } from 'libs/contracts';
import { convertPercentageFromSmartContract } from 'utilities';

export interface GetVaiRepayAprInput {
  vaiControllerContract: VaiController;
}

export interface GetVaiRepayAprOutput {
  repayAprPercentage: BigNumber;
}

const getVaiRepayApr = async ({
  vaiControllerContract,
}: GetVaiRepayAprInput): Promise<GetVaiRepayAprOutput> => {
  const vaiRepayRateMantissa = await vaiControllerContract.getVAIRepayRate();

  const vaiRepayAprPercentage = new BigNumber(
    convertPercentageFromSmartContract(vaiRepayRateMantissa.toString()),
  );

  return {
    repayAprPercentage: vaiRepayAprPercentage,
  };
};

export default getVaiRepayApr;
