import BigNumber from 'bignumber.js';
import { getContractAddress } from 'utilities';

import { VenusLens } from 'types/contracts';

export interface GetXvsRewardInput {
  lensContract: VenusLens;
  accountAddress: string;
}

export type GetXvsRewardOutput = BigNumber;

const getXvsReward = async ({
  lensContract,
  accountAddress,
}: GetXvsRewardInput): Promise<GetXvsRewardOutput> => {
  const pendingVenus = await lensContract.methods
    .pendingVenus(accountAddress, getContractAddress('comptroller'))
    .call();
  return new BigNumber(pendingVenus);
};

export default getXvsReward;
