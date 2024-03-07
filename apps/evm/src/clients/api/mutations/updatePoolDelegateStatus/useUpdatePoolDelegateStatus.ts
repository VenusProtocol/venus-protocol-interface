import { UpdatePoolDelegateStatusInput, queryClient, updatePoolDelegateStatus } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useGetIsolatedPoolComptrollerContract } from 'libs/contracts';
import { callOrThrow } from 'utilities';

type TrimmedUpdatePoolDelegateStatusInput = Omit<
  UpdatePoolDelegateStatusInput,
  'poolComptrollerContract' | 'approvedStatus'
> & { poolComptrollerAddress: string };
type Options = UseSendTransactionOptions<{ approvedStatus: boolean }>;

const useUpdatePoolDelegateStatus = (
  { poolComptrollerAddress, delegateAddress }: TrimmedUpdatePoolDelegateStatusInput,
  options?: Options,
) => {
  const poolComptrollerContract = useGetIsolatedPoolComptrollerContract({
    address: poolComptrollerAddress,
    passSigner: true,
  });

  return useSendTransaction({
    fnKey: [FunctionKey.UPDATE_POOL_DELEGATE_STATUS, { poolComptrollerAddress, delegateAddress }],
    fn: (input: { approvedStatus: boolean }) =>
      callOrThrow({ poolComptrollerContract, delegateAddress }, params =>
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
          delegateAddress,
          accountAddress: accountAddress || '',
          poolComptrollerAddress,
        },
      ]);
    },
    options,
  });
};

export default useUpdatePoolDelegateStatus;
