import BigNumber from 'bignumber.js';

import { XvsVault } from 'types/contracts';
import { convertCoinsToWei } from 'utilities/common';
import { getTokenByAddress } from 'utilities';
import { VError } from 'errors';

export interface GetXvsVaultPendingRewardWeiInput {
  xvsVaultContract: XvsVault;
  tokenAddress: string;
  pid: number;
  accountAddress: string;
}

export type GetXvsVaultPendingRewardWeiOutput = BigNumber;

const GetXvsVaultPendingRewardWei = async ({
  xvsVaultContract,
  tokenAddress,
  pid,
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
    .pendingReward(tokenAddress, pid, accountAddress)
    .call();
  const pendingRewardXvs = new BigNumber(res).dividedBy(token.decimals);
  return convertCoinsToWei({
    value: pendingRewardXvs,
    tokenId: token.id,
  });
};

export default GetXvsVaultPendingRewardWei;
