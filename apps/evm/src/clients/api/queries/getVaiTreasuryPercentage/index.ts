import BigNumber from 'bignumber.js';

import type { VaiController } from 'libs/contracts';

export interface GetVaiTreasuryPercentageInput {
  vaiControllerContract: VaiController;
}

export type GetVaiTreasuryPercentageOutput = {
  percentage: BigNumber;
};

const getVaiTreasuryPercentage = async ({
  vaiControllerContract,
}: GetVaiTreasuryPercentageInput): Promise<GetVaiTreasuryPercentageOutput> => {
  const treasuryPercentage = await vaiControllerContract.treasuryPercent();
  const formattedTreasuryPercentage = new BigNumber(treasuryPercentage.toString())
    .times(100)
    .div(1e18);

  return {
    percentage: formattedTreasuryPercentage,
  };
};

export default getVaiTreasuryPercentage;
