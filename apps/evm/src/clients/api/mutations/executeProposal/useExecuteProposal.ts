import { type ExecuteProposalInput, executeProposal, queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import {
  getOmnichainGovernanceExecutorContract,
  useGetGovernorBravoDelegateContract,
} from 'libs/contracts';
import { VError } from 'libs/errors';
import { governanceChain, useSigner } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';

type TrimmedExecuteProposalInput = Omit<ExecuteProposalInput, 'contract'>;
type Input = TrimmedExecuteProposalInput & {
  chainId: ChainId;
};
type Options = UseSendTransactionOptions<TrimmedExecuteProposalInput>;

const useExecuteProposal = (options?: Partial<Options>) => {
  const governorBravoDelegateContract = useGetGovernorBravoDelegateContract({
    passSigner: true,
  });

  const { signer } = useSigner();

  return useSendTransaction({
    fnKey: [FunctionKey.EXECUTE_PROPOSAL],
    fn: (input: Input) => {
      if (!signer) {
        throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
      }

      const contract =
        input.chainId === governanceChain.id
          ? governorBravoDelegateContract
          : getOmnichainGovernanceExecutorContract({
              signerOrProvider: signer,
              chainId: input.chainId,
            });

      return callOrThrow({ contract }, params =>
        executeProposal({
          ...input,
          ...params,
        }),
      );
    },
    onConfirmed: async ({ input }) => {
      queryClient.invalidateQueries({
        queryKey: [FunctionKey.GET_PROPOSALS],
      });

      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_PROPOSAL,
          {
            id: input.proposalId,
          },
        ],
      });
    },
    options,
  });
};

export default useExecuteProposal;
