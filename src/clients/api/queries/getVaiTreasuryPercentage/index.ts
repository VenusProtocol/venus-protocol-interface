import BigNumber from 'bignumber.js';

import { VaiController } from 'types/contracts';

export interface GetVaiTreasuryPercentageInput {
  vaiControllerContract: VaiController;
}

export type GetVaiTreasuryPercentageOutput = {
  percentage: number;
};

const getVaiTreasuryPercentage = async ({
  vaiControllerContract,
}: GetVaiTreasuryPercentageInput): Promise<GetVaiTreasuryPercentageOutput> => {
  const treasuryPercentage = await vaiControllerContract.methods.treasuryPercent().call();
  const formattedTreasuryPercentage = new BigNumber(treasuryPercentage)
    .times(100)
    .div(1e18)
    .toNumber();

  return {
    percentage: formattedTreasuryPercentage,
  };
};

export default getVaiTreasuryPercentage;
