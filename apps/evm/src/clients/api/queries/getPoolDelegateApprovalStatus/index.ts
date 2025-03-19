import { isolatedPoolComptrollerAbi } from 'libs/contracts';
import type { Address, PublicClient } from 'viem';

export interface GetNativeTokenGatewayDelegateApprovalInput {
  publicClient: PublicClient;
  poolComptrollerAddress: string;
  delegateeAddress: string;
  accountAddress: string;
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
    address: poolComptrollerAddress as Address,
    functionName: 'approvedDelegates',
    args: [accountAddress as Address, delegateeAddress as Address],
  });

  return {
    isDelegateeApproved,
  };
};

export default getPoolDelegateApprovalStatus;
