import BigNumber from 'bignumber.js';
import { MainPoolComptroller } from 'packages/contracts';

import { BLOCKS_PER_DAY } from 'constants/bsc';

export interface GetVenusVaiVaultDailyRateInput {
  mainPoolComptrollerContract: MainPoolComptroller;
}

export type GetVenusVaiVaultDailyRateOutput = {
  dailyRateWei: BigNumber;
};

const getVenusVaiVaultDailyRate = async ({
  mainPoolComptrollerContract,
}: GetVenusVaiVaultDailyRateInput): Promise<GetVenusVaiVaultDailyRateOutput> => {
  const resp = await mainPoolComptrollerContract.venusVAIVaultRate();

  return {
    dailyRateWei: new BigNumber(resp.toString()).times(BLOCKS_PER_DAY),
  };
};

export default getVenusVaiVaultDailyRate;
