import BigNumber from 'bignumber.js';
import { ContractTypeByName } from 'packages/contracts';

export interface GetXvsVaultRewardPerBlockInput {
  xvsVaultContract: ContractTypeByName<'xvsVault'>;
  tokenAddress: string;
}

export type GetXvsVaultRewardPerBlockOutput = {
  rewardPerBlockWei: BigNumber;
};

const getXvsVaultRewardPerBlock = async ({
  xvsVaultContract,
  tokenAddress,
}: GetXvsVaultRewardPerBlockInput): Promise<GetXvsVaultRewardPerBlockOutput> => {
  const res = await xvsVaultContract.rewardTokenAmountsPerBlock(tokenAddress);

  return {
    rewardPerBlockWei: new BigNumber(res.toString()),
  };
};

export default getXvsVaultRewardPerBlock;
