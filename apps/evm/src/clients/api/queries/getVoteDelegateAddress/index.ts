import { NULL_ADDRESS } from 'constants/address';
import { xvsVaultAbi } from 'libs/contracts';
import type { Address, PublicClient } from 'viem';

export interface GetVoteDelegateAddressInput {
  publicClient: PublicClient;
  xvsVaultAddress: Address;
  accountAddress: Address;
}

export type GetVoteDelegateAddressOutput = {
  delegateAddress: Address | undefined;
};

export const getVoteDelegateAddress = async ({
  publicClient,
  xvsVaultAddress,
  accountAddress,
}: GetVoteDelegateAddressInput): Promise<GetVoteDelegateAddressOutput> => {
  const resp = await publicClient.readContract({
    address: xvsVaultAddress,
    abi: xvsVaultAbi,
    functionName: 'delegates',
    args: [accountAddress],
  });

  return {
    delegateAddress: resp !== NULL_ADDRESS ? resp : undefined,
  };
};
