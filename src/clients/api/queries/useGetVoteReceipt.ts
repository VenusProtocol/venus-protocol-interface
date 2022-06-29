import { useQuery, QueryObserverOptions } from 'react-query';
import { useGovernorBravoDelegateContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';
import getVoteReceipt, { GetVoteReceiptOutput } from './getVoteReceipt';

type Options = QueryObserverOptions<
  GetVoteReceiptOutput,
  Error,
  GetVoteReceiptOutput,
  GetVoteReceiptOutput,
  [FunctionKey.GET_VOTE_RECEIPT, string, string]
>;

const useGetVoteReceipt = (
  { proposalId, accountAddress }: { proposalId: number; accountAddress: string | undefined },
  options?: Options,
) => {
  const governorBravoContract = useGovernorBravoDelegateContract();

  return useQuery(
    [FunctionKey.GET_VOTE_RECEIPT, proposalId, accountAddress],
    () =>
      getVoteReceipt({
        governorBravoContract,
        proposalId,
        accountAddress: accountAddress || '',
      }),
    {
      enabled:
        (options?.enabled === undefined || options?.enabled) &&
        // Check user have connected their wallet
        accountAddress !== undefined,
    },
  );
};

export default useGetVoteReceipt;
