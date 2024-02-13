import BigNumber from 'bignumber.js';

import { LegacyPoolComptroller } from 'libs/contracts';

export interface GetVenusVaiVaultDailyRateInput {
  blocksPerDay: number;
  legacyPoolComptrollerContract: LegacyPoolComptroller;
}

export type GetVenusVaiVaultDailyRateOutput = {
  dailyRateMantissa: BigNumber;
};

const getVenusVaiVaultDailyRate = async ({
  blocksPerDay,
  legacyPoolComptrollerContract,
}: GetVenusVaiVaultDailyRateInput): Promise<GetVenusVaiVaultDailyRateOutput> => {
  const resp = await legacyPoolComptrollerContract.venusVAIVaultRate();

  return {
    dailyRateMantissa: new BigNumber(resp.toString()).times(blocksPerDay),
  };
};

export default getVenusVaiVaultDailyRate;
