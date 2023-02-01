import BigNumber from 'bignumber.js';
import { getContractAddress } from 'utilities';

import { VenusLens } from 'types/contracts';

export interface GetXvsRewardInput {
  lensContract: VenusLens;
  accountAddress: string;
}

export type GetXvsRewardOutput = {
  xvsRewardWei: BigNumber;
};

const getXvsReward = async ({
  lensContract,
  accountAddress,
}: GetXvsRewardInput): Promise<GetXvsRewardOutput> => {
  const res = await lensContract.pendingVenus(accountAddress, getContractAddress('comptroller'));
  return {
    xvsRewardWei: new BigNumber(res.toString()),
  };
};

export default getXvsReward;
