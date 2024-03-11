import type { IsolatedPoolComptroller } from 'libs/contracts';

export interface GetNativeTokenGatewayDelegateApprovalInput {
  poolComptrollerContract: IsolatedPoolComptroller;
  delegateeAddress: string;
  accountAddress: string;
}

export interface GetNativeTokenGatewayDelegateApprovalOutput {
  isDelegateeApproved: boolean;
}

const getPoolDelegateApprovalStatus = async ({
  poolComptrollerContract,
  delegateeAddress,
  accountAddress,
}: GetNativeTokenGatewayDelegateApprovalInput) => {
  const isDelegateeApproved = await poolComptrollerContract.approvedDelegates(
    accountAddress,
    delegateeAddress,
  );

  return {
    isDelegateeApproved,
  };
};

export default getPoolDelegateApprovalStatus;
