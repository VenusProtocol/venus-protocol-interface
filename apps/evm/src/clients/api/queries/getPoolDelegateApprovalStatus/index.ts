import { IsolatedPoolComptroller } from 'libs/contracts';

export interface GetNativeTokenGatewayDelegateApprovalInput {
  poolComptrollerContract: IsolatedPoolComptroller;
  delegateAddress: string;
  accountAddress: string;
}

const getPoolDelegateApprovalStatus = async ({
  poolComptrollerContract,
  delegateAddress,
  accountAddress,
}: GetNativeTokenGatewayDelegateApprovalInput) => {
  const res = await poolComptrollerContract.approvedDelegates(accountAddress, delegateAddress);

  return res;
};

export default getPoolDelegateApprovalStatus;
