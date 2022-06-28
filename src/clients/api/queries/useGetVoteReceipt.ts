import { useQuery, QueryObserverOptions } from 'react-query';
import { useGovernorBravoDelegateContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';
import getVoteReceipt, { IGetVoteReceiptOutput } from './getVoteReceipt';

type Options = QueryObserverOptions<
  IGetVoteReceiptOutput,
  Error,
  IGetVoteReceiptOutput,
  IGetVoteReceiptOutput,
  [FunctionKey.GET_VOTE_RECEIPT, { proposalId: number; accountAddress: string | undefined }]
>;

const useGetVoteReceipt = (
  params: { proposalId: number; accountAddress: string | undefined },
  options?: Options,
) => {
  const { proposalId, accountAddress } = params;
  const governorBravoContract = useGovernorBravoDelegateContract();

  return useQuery(
    [FunctionKey.GET_VOTE_RECEIPT, params],
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
