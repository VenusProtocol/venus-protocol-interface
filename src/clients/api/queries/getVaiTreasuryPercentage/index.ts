import BigNumber from 'bignumber.js';

import { VaiController } from 'packages/contracts';

export interface GetVaiTreasuryPercentageInput {
  vaiControllerContract: VaiController;
}

export type GetVaiTreasuryPercentageOutput = {
  percentage: number;
};

const getVaiTreasuryPercentage = async ({
  vaiControllerContract,
}: GetVaiTreasuryPercentageInput): Promise<GetVaiTreasuryPercentageOutput> => {
  const treasuryPercentage = await vaiControllerContract.treasuryPercent();
  const formattedTreasuryPercentage = new BigNumber(treasuryPercentage.toString())
    .times(100)
    .div(1e18)
    .toNumber();

  return {
    percentage: formattedTreasuryPercentage,
  };
};

export default getVaiTreasuryPercentage;
