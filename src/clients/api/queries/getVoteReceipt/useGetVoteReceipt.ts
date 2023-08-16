import { QueryObserverOptions, useQuery } from 'react-query';
import { callOrThrow } from 'utilities';

import FunctionKey from 'constants/functionKey';
import useGetUniqueContract from 'hooks/useGetUniqueContract';

import getVoteReceipt, { GetVoteReceiptInput, GetVoteReceiptOutput } from '.';

type TrimmedGetVoteReceiptInput = Omit<GetVoteReceiptInput, 'governorBravoDelegateContract'>;

type Options = QueryObserverOptions<
  GetVoteReceiptOutput,
  Error,
  GetVoteReceiptOutput,
  GetVoteReceiptOutput,
  [FunctionKey.GET_VOTE_RECEIPT, TrimmedGetVoteReceiptInput]
>;

const useGetVoteReceipt = (input: TrimmedGetVoteReceiptInput, options?: Options) => {
  const { accountAddress } = input;
  const governorBravoDelegateContract = useGetUniqueContract({
    name: 'governorBravoDelegate',
  });

  return useQuery(
    [FunctionKey.GET_VOTE_RECEIPT, input],
    () =>
      callOrThrow({ governorBravoDelegateContract }, params =>
        getVoteReceipt({
          ...input,
          ...params,
        }),
      ),
    {
      enabled:
        (options?.enabled === undefined || options?.enabled) &&
        // Check user have connected their wallet
        accountAddress !== undefined,
    },
  );
};

export default useGetVoteReceipt;
