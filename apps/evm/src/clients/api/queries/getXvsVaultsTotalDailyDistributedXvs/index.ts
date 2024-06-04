import type BigNumber from 'bignumber.js';

import type { XvsVault } from 'libs/contracts';
import type { Token } from 'types';
import { calculateDailyTokenRate } from 'utilities';

export interface GetXvsVaultsTotalDailyDistributedXvsInput {
  xvsVaultContract: XvsVault;
  stakedToken: Token;
  blocksPerDay?: number;
}

export type GetXvsVaultsTotalDailyDistributedXvsOutput = {
  dailyDistributedXvs: BigNumber;
};

export const getXvsVaultsTotalDailyDistributedXvs = async ({
  xvsVaultContract,
  stakedToken,
  blocksPerDay,
}: GetXvsVaultsTotalDailyDistributedXvsInput): Promise<GetXvsVaultsTotalDailyDistributedXvsOutput> => {
  const mantissaPerBlockOrSecond = await xvsVaultContract.rewardTokenAmountsPerBlockOrSecond(
    stakedToken.address,
  );

  const dailyDistributedXvs = calculateDailyTokenRate({
    rateMantissa: mantissaPerBlockOrSecond.toString(),
    decimals: stakedToken.decimals,
    blocksPerDay,
  });

  return {
    dailyDistributedXvs,
  };
};
