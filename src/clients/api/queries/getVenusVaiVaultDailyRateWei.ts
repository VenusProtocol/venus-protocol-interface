import BigNumber from 'bignumber.js';
import { Comptroller } from 'types/contracts';
import { BLOCKS_PER_DAY } from 'constants/bsc';

export interface IGetVenusVaiVaultDailyRateWeiInput {
  comptrollerContract: Comptroller;
}

export type GetVenusVaiVaultDailyRateWeiOutput = BigNumber;

const getVenusVaiVaultDailyRateWei = async ({
  comptrollerContract,
}: IGetVenusVaiVaultDailyRateWeiInput): Promise<GetVenusVaiVaultDailyRateWeiOutput> => {
  const resp = await comptrollerContract.methods.venusVAIVaultRate().call();

  return new BigNumber(resp).times(BLOCKS_PER_DAY);
};

export default getVenusVaiVaultDailyRateWei;
