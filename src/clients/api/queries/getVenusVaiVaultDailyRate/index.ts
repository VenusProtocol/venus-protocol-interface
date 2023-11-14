import BigNumber from 'bignumber.js';
import { MainPoolComptroller } from 'packages/contracts';

export interface GetVenusVaiVaultDailyRateInput {
  blocksPerDay: number;
  mainPoolComptrollerContract: MainPoolComptroller;
}

export type GetVenusVaiVaultDailyRateOutput = {
  dailyRateWei: BigNumber;
};

const getVenusVaiVaultDailyRate = async ({
  blocksPerDay,
  mainPoolComptrollerContract,
}: GetVenusVaiVaultDailyRateInput): Promise<GetVenusVaiVaultDailyRateOutput> => {
  const resp = await mainPoolComptrollerContract.venusVAIVaultRate();

  return {
    dailyRateWei: new BigNumber(resp.toString()).times(blocksPerDay),
  };
};

export default getVenusVaiVaultDailyRate;
