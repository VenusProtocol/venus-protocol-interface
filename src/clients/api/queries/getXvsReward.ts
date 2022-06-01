import BigNumber from 'bignumber.js';
import { getContractAddress, getToken } from 'utilities';
import { VBEP_TOKEN_DECIMALS } from 'constants/tokens';
import { VenusLens } from 'types/contracts';

export interface IGetXvsRewardInput {
  lensContract: VenusLens;
  accountAddress: string;
}

export type GetXvsRewardOutput = BigNumber;

const getXvsReward = async ({
  lensContract,
  accountAddress,
}: IGetXvsRewardInput): Promise<GetXvsRewardOutput> => {
  const pendingVenus = await lensContract.methods
    .pendingVenus(accountAddress, getContractAddress('comptroller'))
    .call();

  const totalXvsEarned = new BigNumber(pendingVenus).dividedBy(1e18).dp(VBEP_TOKEN_DECIMALS, 1);

  // Calculate and return total XVS reward
  const xvsDecimals = getToken('xvs').decimals;
  const xvsRewardWei = totalXvsEarned.multipliedBy(new BigNumber(10).pow(xvsDecimals));

  return xvsRewardWei;
};

export default getXvsReward;
