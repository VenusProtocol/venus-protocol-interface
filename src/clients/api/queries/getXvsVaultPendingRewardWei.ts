import BigNumber from 'bignumber.js';

import { XvsVault } from 'types/contracts';
import { convertCoinsToWei } from 'utilities/common';
import { getTokenByAddress } from 'utilities';
import { VError } from 'errors';

export interface GetXvsVaultPendingRewardWeiInput {
  xvsVaultContract: XvsVault;
  tokenAddress: string;
  poolIndex: number;
  accountAddress: string;
}

export type GetXvsVaultPendingRewardWeiOutput = BigNumber;

const getXvsVaultPendingRewardWei = async ({
  xvsVaultContract,
  tokenAddress,
  poolIndex,
  accountAddress,
}: GetXvsVaultPendingRewardWeiInput): Promise<GetXvsVaultPendingRewardWeiOutput> => {
  const token = getTokenByAddress(tokenAddress);

  if (!token) {
    throw new VError({
      type: 'unexpected',
      code: 'invalidTokenAddressProvided',
    });
  }

  const res = await xvsVaultContract.methods
    .pendingReward(tokenAddress, poolIndex, accountAddress)
    .call();
  const pendingRewardXvs = new BigNumber(res).dividedBy(token.decimals);
  return convertCoinsToWei({
    value: pendingRewardXvs,
    tokenId: token.id,
  });
};

export default getXvsVaultPendingRewardWei;
