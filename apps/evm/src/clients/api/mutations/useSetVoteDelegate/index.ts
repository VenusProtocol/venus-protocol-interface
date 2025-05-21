import { queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { xvsVaultAbi } from 'libs/contracts';
import { VError } from 'libs/errors';
import { useAccountAddress } from 'libs/wallet';
import type { Address } from 'viem';

type SetVoteDelegateInput = {
  delegateAddress: Address;
};
type Options = UseSendTransactionOptions<SetVoteDelegateInput>;

export const useSetVoteDelegate = (options?: Partial<Options>) => {
  const { address: xvsVaultContractAddress } = useGetContractAddress({
    name: 'XvsVault',
  });
  const { accountAddress } = useAccountAddress();

  return useSendTransaction({
    fn: ({ delegateAddress }: SetVoteDelegateInput) => {
      if (!xvsVaultContractAddress) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      return {
        abi: xvsVaultAbi,
        address: xvsVaultContractAddress,
        functionName: 'delegate',
        args: [delegateAddress],
      };
    },
    onConfirmed: async () => {
      queryClient.invalidateQueries({
        queryKey: [FunctionKey.GET_VOTE_DELEGATE_ADDRESS, { accountAddress }],
      });

      queryClient.invalidateQueries({
        queryKey: [FunctionKey.GET_CURRENT_VOTES, accountAddress],
      });
    },
    options,
  });
};
