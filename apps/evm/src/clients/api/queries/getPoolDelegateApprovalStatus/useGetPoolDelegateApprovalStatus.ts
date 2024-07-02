import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import getPoolDelegateApprovalStatus, {
  type GetNativeTokenGatewayDelegateApprovalInput,
  type GetNativeTokenGatewayDelegateApprovalOutput,
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
  GetNativeTokenGatewayDelegateApprovalOutput,
  Error,
  GetNativeTokenGatewayDelegateApprovalOutput,
  GetNativeTokenGatewayDelegateApprovalOutput,
  UseGetPoolDelegateApprovalStatusQueryKey
>;

const useGetPoolDelegateApprovalStatus = (
  {
    poolComptrollerAddress,
    delegateeAddress,
    accountAddress,
  }: TrimmedGetNativeTokenGatewayDelegateApprovalInput,
  options?: Partial<Options>,
) => {
  const poolComptrollerContract = useGetIsolatedPoolComptrollerContract({
    address: poolComptrollerAddress,
    passSigner: false,
  });

  const queryKey: UseGetPoolDelegateApprovalStatusQueryKey = [
    FunctionKey.GET_POOL_DELEGATE_APPROVAL_STATUS,
    {
      delegateeAddress,
      accountAddress: accountAddress || '',
      poolComptrollerAddress,
    },
  ];

  return useQuery({
    queryKey: queryKey,

    queryFn: () =>
      callOrThrow({ poolComptrollerContract, delegateeAddress, accountAddress }, params =>
        getPoolDelegateApprovalStatus({
          ...params,
        }),
      ),

    ...options,
  });
};

export default useGetPoolDelegateApprovalStatus;
