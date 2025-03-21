import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import getPoolDelegateApprovalStatus, {
  type GetNativeTokenGatewayDelegateApprovalInput,
  type GetNativeTokenGatewayDelegateApprovalOutput,
} from 'clients/api/queries/getPoolDelegateApprovalStatus';
import { NULL_ADDRESS } from 'constants/address';
import FunctionKey from 'constants/functionKey';
import { usePublicClient } from 'libs/wallet';
import { callOrThrow } from 'utilities';
import type { Address } from 'viem';

type TrimmedGetNativeTokenGatewayDelegateApprovalInput = Omit<
  GetNativeTokenGatewayDelegateApprovalInput,
  'publicClient'
> & { poolComptrollerAddress: Address };

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
  const { publicClient } = usePublicClient();

  const queryKey: UseGetPoolDelegateApprovalStatusQueryKey = [
    FunctionKey.GET_POOL_DELEGATE_APPROVAL_STATUS,
    {
      delegateeAddress,
      accountAddress: accountAddress || NULL_ADDRESS,
      poolComptrollerAddress,
    },
  ];

  return useQuery({
    queryKey: queryKey,

    queryFn: () =>
      callOrThrow(
        { publicClient, delegateeAddress, accountAddress, poolComptrollerAddress },
        params =>
          getPoolDelegateApprovalStatus({
            ...params,
          }),
      ),

    ...options,
  });
};

export default useGetPoolDelegateApprovalStatus;
