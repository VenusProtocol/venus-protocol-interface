import BigNumber from 'bignumber.js';
import { vaiVaultAbi } from 'libs/contracts';
import type { Address, PublicClient } from 'viem';

export interface GetVaiVaultUserInfoInput {
  publicClient: PublicClient;
  vaiVaultAddress: Address;
  accountAddress: Address;
}

export interface GetVaiVaultUserInfoOutput {
  stakedVaiMantissa: BigNumber;
}

export const getVaiVaultUserInfo = async ({
  publicClient,
  vaiVaultAddress,
  accountAddress,
}: GetVaiVaultUserInfoInput): Promise<GetVaiVaultUserInfoOutput> => {
  const [stakedVaiMantissa] = await publicClient.readContract({
    address: vaiVaultAddress,
    abi: vaiVaultAbi,
    functionName: 'userInfo',
    args: [accountAddress],
  });

  return {
    stakedVaiMantissa: new BigNumber(stakedVaiMantissa.toString()),
  };
};
