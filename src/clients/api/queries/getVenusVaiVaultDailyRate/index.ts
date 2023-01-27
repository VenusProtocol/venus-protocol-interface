import BigNumber from 'bignumber.js';

import { BLOCKS_PER_DAY } from 'constants/bsc';
import { Comptroller } from 'types/contracts';

export interface GetVenusVaiVaultDailyRateInput {
  comptrollerContract: Comptroller;
}

export type GetVenusVaiVaultDailyRateOutput = {
  dailyRateWei: BigNumber;
};

const getVenusVaiVaultDailyRate = async ({
  comptrollerContract,
}: GetVenusVaiVaultDailyRateInput): Promise<GetVenusVaiVaultDailyRateOutput> => {
  const resp = await comptrollerContract.venusVAIVaultRate();

  return {
    dailyRateWei: new BigNumber(resp.toString()).times(BLOCKS_PER_DAY),
  };
};

export default getVenusVaiVaultDailyRate;
