import BigNumber from 'bignumber.js';

import { BLOCKS_PER_DAY } from 'constants/bsc';
import { Comptroller } from 'types/contracts';

export interface GetVenusVaiVaultDailyRateWeiInput {
  comptrollerContract: Comptroller;
}

export type GetVenusVaiVaultDailyRateWeiOutput = BigNumber;

const getVenusVaiVaultDailyRateWei = async ({
  comptrollerContract,
}: GetVenusVaiVaultDailyRateWeiInput): Promise<GetVenusVaiVaultDailyRateWeiOutput> => {
  const resp = await comptrollerContract.methods.venusVAIVaultRate().call();

  return new BigNumber(resp).times(BLOCKS_PER_DAY);
};

export default getVenusVaiVaultDailyRateWei;
