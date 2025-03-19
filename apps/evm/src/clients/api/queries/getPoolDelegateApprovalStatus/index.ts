import { isolatedPoolComptrollerAbi } from 'libs/contracts';
import type { Address, PublicClient } from 'viem';

export interface GetNativeTokenGatewayDelegateApprovalInput {
  publicClient: PublicClient;
  poolComptrollerAddress: Address;
  delegateeAddress: Address;
  accountAddress: Address;
}

export interface GetNativeTokenGatewayDelegateApprovalOutput {
  isDelegateeApproved: boolean;
}

const getPoolDelegateApprovalStatus = async ({
  publicClient,
  poolComptrollerAddress,
  delegateeAddress,
  accountAddress,
}: GetNativeTokenGatewayDelegateApprovalInput) => {
  const isDelegateeApproved = await publicClient.readContract({
    abi: isolatedPoolComptrollerAbi,
    address: poolComptrollerAddress,
    functionName: 'approvedDelegates',
    args: [accountAddress, delegateeAddress],
  });

  return {
    isDelegateeApproved,
  };
};

export default getPoolDelegateApprovalStatus;
