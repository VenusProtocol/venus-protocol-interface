import BigNumber from 'bignumber.js';

import { XvsVault } from 'types/contracts';
import { convertCoinsToWei } from 'utilities/common';
import { getTokenByAddress } from 'utilities';
import { VError } from 'errors';

export interface GetXvsVaultUserInfoInput {
  xvsVaultContract: XvsVault;
  tokenAddress: string;
  pid: number;
  accountAddress: string;
}

export interface GetXvsVaultUserInfoOutput {
  stakedAmountWei: BigNumber;
  pendingWithdrawalsTotalAmountWei: BigNumber;
  rewardDebtAmountWei: BigNumber;
}

const GetXvsVaultUserInfo = async ({
  xvsVaultContract,
  tokenAddress,
  pid,
  accountAddress,
}: GetXvsVaultUserInfoInput): Promise<GetXvsVaultUserInfoOutput> => {
  const token = getTokenByAddress(tokenAddress);

  if (!token) {
    throw new VError({
      type: 'unexpected',
      code: 'invalidTokenAddressProvided',
    });
  }

  const res = await xvsVaultContract.methods.getUserInfo(tokenAddress, pid, accountAddress).call();

  const stakedAmountTokens = new BigNumber(res.amount).dividedBy(token.decimals);
  const pendingWithdrawalsTotalAmountTokens = new BigNumber(res.pendingWithdrawals).dividedBy(
    token.decimals,
  );
  const rewardDebtAmountTokens = new BigNumber(res.rewardDebt).dividedBy(token.decimals);

  return {
    stakedAmountWei: convertCoinsToWei({
      value: stakedAmountTokens,
      tokenId: token.id,
    }),
    pendingWithdrawalsTotalAmountWei: convertCoinsToWei({
      value: pendingWithdrawalsTotalAmountTokens,
      tokenId: token.id,
    }),
    rewardDebtAmountWei: convertCoinsToWei({
      value: rewardDebtAmountTokens,
      tokenId: token.id,
    }),
  };
};

export default GetXvsVaultUserInfo;
