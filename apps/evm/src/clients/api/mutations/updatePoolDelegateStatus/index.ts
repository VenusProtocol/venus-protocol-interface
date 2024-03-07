import { IsolatedPoolComptroller } from 'libs/contracts';

export interface UpdatePoolDelegateStatusInput {
  poolComptrollerContract: IsolatedPoolComptroller;
  delegateAddress: string;
  approvedStatus: boolean;
}

const updateDelegate = async ({
  poolComptrollerContract,
  delegateAddress,
  approvedStatus,
}: UpdatePoolDelegateStatusInput) =>
  poolComptrollerContract.updateDelegate(delegateAddress, approvedStatus);

export default updateDelegate;
