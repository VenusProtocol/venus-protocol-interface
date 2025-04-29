import { queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { isolatedPoolComptrollerAbi } from 'libs/contracts';
import { useAccountAddress } from 'libs/wallet';
import type { Address } from 'viem';

type UpdatePoolDelegateStatusInput = {
  approvedStatus: boolean;
  poolComptrollerAddress: Address;
  delegateeAddress: Address;
};

type Options = UseSendTransactionOptions<{ approvedStatus: boolean }>;

export const useUpdatePoolDelegateStatus = (options?: Partial<Options>) => {
  const { accountAddress } = useAccountAddress();

  return useSendTransaction({
    fn: ({
      delegateeAddress,
      poolComptrollerAddress,
      approvedStatus,
    }: UpdatePoolDelegateStatusInput) => ({
      abi: isolatedPoolComptrollerAbi,
      address: poolComptrollerAddress,
      functionName: 'updateDelegate',
      args: [delegateeAddress, approvedStatus],
    }),
    onConfirmed: async ({ input }) => {
      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_POOL_DELEGATE_APPROVAL_STATUS,
          {
            delegateeAddress: input.delegateeAddress,
            poolComptrollerAddress: input.poolComptrollerAddress,
            accountAddress: accountAddress || '',
          },
        ],
      });
    },
    options,
  });
};
