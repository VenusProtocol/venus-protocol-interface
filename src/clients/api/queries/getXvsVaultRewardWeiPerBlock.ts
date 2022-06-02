import BigNumber from 'bignumber.js';

import { XvsVault } from 'types/contracts';
import { convertCoinsToWei } from 'utilities/common';
import { getTokenByAddress } from 'utilities';
import { VError } from 'errors';

export interface IGetXvsVaultRewardWeiPerBlockInput {
  xvsVaultContract: XvsVault;
  tokenAddress: string;
}

export type GetXvsVaultRewardWeiPerBlockOutput = BigNumber;

const getXvsVaultRewardWeiPerBlock = async ({
  xvsVaultContract,
  tokenAddress,
}: IGetXvsVaultRewardWeiPerBlockInput): Promise<GetXvsVaultRewardWeiPerBlockOutput> => {
  const token = getTokenByAddress(tokenAddress);

  if (!token) {
    throw new VError({
      type: 'unexpected',
      code: 'invalidTokenAddressProvided',
    });
  }

  const res = await xvsVaultContract.methods.rewardTokenAmountsPerBlock(tokenAddress).call();
  const rewardPerBlockXvs = new BigNumber(res).dividedBy(token.decimals);
  return convertCoinsToWei({
    value: rewardPerBlockXvs,
    tokenId: token.id,
  });
};

export default getXvsVaultRewardWeiPerBlock;
