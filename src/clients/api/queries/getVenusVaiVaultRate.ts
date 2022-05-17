import BigNumber from 'bignumber.js';
import { Comptroller } from 'types/contracts';
import { getToken } from 'utilities';
import { BLOCKS_PER_DAY } from 'constants/blocksPerDay';

export interface IGetVenusVaiVaultRateInput {
  comptrollerContract: Comptroller;
}

export type GetVenusVaiVaultRateOutput = BigNumber;

const getVenusVaiVaultRate = async ({
  comptrollerContract,
}: IGetVenusVaiVaultRateInput): Promise<GetVenusVaiVaultRateOutput> => {
  const resp = await comptrollerContract.methods.venusVAIVaultRate().call();
  return new BigNumber(resp)
    .div(new BigNumber(10).pow(getToken('xvs').decimals))
    .times(BLOCKS_PER_DAY);
};

export default getVenusVaiVaultRate;
