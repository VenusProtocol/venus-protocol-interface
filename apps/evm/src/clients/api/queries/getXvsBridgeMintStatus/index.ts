import BigNumber from 'bignumber.js';
import type { Address, PublicClient } from 'viem';

import { xvsTokenOmnichainAbi } from 'libs/contracts';

export interface GetXvsMintStatusInput {
  chainXvsProxyOftDestContractAddress: Address;
  xvsTokenOmnichainContractAddress: Address;
  publicClient: PublicClient;
}

export interface GetXvsMintStatusOutput {
  minterToCapMantissa: BigNumber;
  bridgeAmountMintedMantissa: BigNumber;
}

export const getXvsBridgeMintStatus = async ({
  chainXvsProxyOftDestContractAddress,
  xvsTokenOmnichainContractAddress,
  publicClient,
}: GetXvsMintStatusInput): Promise<GetXvsMintStatusOutput> => {
  const [minterToCap, bridgeAmountMinted] = await Promise.all([
    publicClient.readContract({
      address: xvsTokenOmnichainContractAddress,
      abi: xvsTokenOmnichainAbi,
      functionName: 'minterToCap',
      args: [chainXvsProxyOftDestContractAddress],
    }),
    publicClient.readContract({
      address: xvsTokenOmnichainContractAddress,
      abi: xvsTokenOmnichainAbi,
      functionName: 'minterToMintedAmount',
      args: [chainXvsProxyOftDestContractAddress],
    }),
  ]);

  return {
    minterToCapMantissa: new BigNumber(minterToCap.toString()),
    bridgeAmountMintedMantissa: new BigNumber(bridgeAmountMinted.toString()),
  };
};
