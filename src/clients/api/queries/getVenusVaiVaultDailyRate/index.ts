import BigNumber from 'bignumber.js';
import { ContractTypeByName } from 'packages/contracts';

import { BLOCKS_PER_DAY } from 'constants/bsc';

export interface GetVenusVaiVaultDailyRateInput {
  comptrollerContract: ContractTypeByName<'mainPoolComptroller'>;
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
