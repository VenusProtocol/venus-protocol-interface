import {
  type UpdatePoolDelegateStatusInput,
  queryClient,
  updatePoolDelegateStatus,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useGetIsolatedPoolComptrollerContract } from 'libs/contracts';
import { callOrThrow } from 'utilities';

type TrimmedUpdatePoolDelegateStatusInput = Omit<
  UpdatePoolDelegateStatusInput,
  'poolComptrollerContract' | 'approvedStatus'
> & { poolComptrollerAddress: string };
type Options = UseSendTransactionOptions<{ approvedStatus: boolean }>;

const useUpdatePoolDelegateStatus = (
  { poolComptrollerAddress, delegateeAddress }: TrimmedUpdatePoolDelegateStatusInput,
  options?: Options,
) => {
  const poolComptrollerContract = useGetIsolatedPoolComptrollerContract({
    address: poolComptrollerAddress,
    passSigner: true,
  });

  return useSendTransaction({
    fnKey: [FunctionKey.UPDATE_POOL_DELEGATE_STATUS, { poolComptrollerAddress, delegateeAddress }],
    fn: (input: { approvedStatus: boolean }) =>
      callOrThrow({ poolComptrollerContract, delegateeAddress }, params =>
        updatePoolDelegateStatus({
          ...input,
          ...params,
        }),
      ),
    onConfirmed: async () => {
      const accountAddress = await poolComptrollerContract?.signer.getAddress();

      queryClient.invalidateQueries([
        FunctionKey.GET_POOL_DELEGATE_APPROVAL_STATUS,
        {
          delegateeAddress,
          accountAddress: accountAddress || '',
          poolComptrollerAddress,
        },
      ]);
    },
    options,
  });
};

export default useUpdatePoolDelegateStatus;
