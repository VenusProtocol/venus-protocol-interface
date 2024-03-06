import { QueryObserverOptions, useQuery } from 'react-query';

import getPoolDelegateApprovalStatus, {
  GetNativeTokenGatewayDelegateApprovalInput,
} from 'clients/api/queries/getPoolDelegateApprovalStatus';
import FunctionKey from 'constants/functionKey';
import { useGetIsolatedPoolComptrollerContract } from 'libs/contracts';
import { callOrThrow } from 'utilities';

type TrimmedGetNativeTokenGatewayDelegateApprovalInput = Omit<
  GetNativeTokenGatewayDelegateApprovalInput,
  'poolComptrollerContract'
> & { poolComptrollerAddress: string };

export type UseGetPoolDelegateApprovalStatusQueryKey = [
  FunctionKey.GET_POOL_DELEGATE_APPROVAL_STATUS,
  TrimmedGetNativeTokenGatewayDelegateApprovalInput,
];

type Options = QueryObserverOptions<
  boolean,
  Error,
  boolean,
  boolean,
  UseGetPoolDelegateApprovalStatusQueryKey
>;

const useGetPoolDelegateApprovalStatus = (
  {
    poolComptrollerAddress,
    delegateAddress,
    accountAddress,
  }: TrimmedGetNativeTokenGatewayDelegateApprovalInput,
  options?: Options,
) => {
  const poolComptrollerContract = useGetIsolatedPoolComptrollerContract({
    address: poolComptrollerAddress,
    passSigner: false,
  });

  const queryKey: UseGetPoolDelegateApprovalStatusQueryKey = [
    FunctionKey.GET_POOL_DELEGATE_APPROVAL_STATUS,
    {
      delegateAddress,
      accountAddress: accountAddress || '',
      poolComptrollerAddress,
    },
  ];

  return useQuery(
    queryKey,
    () =>
      callOrThrow({ poolComptrollerContract, delegateAddress, accountAddress }, params =>
        getPoolDelegateApprovalStatus({
          ...params,
        }),
      ),
    options,
  );
};

export default useGetPoolDelegateApprovalStatus;
