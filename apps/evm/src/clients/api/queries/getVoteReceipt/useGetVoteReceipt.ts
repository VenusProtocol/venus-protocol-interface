import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { getGovernorBravoDelegateContractAddress } from 'libs/contracts';
import { usePublicClient } from 'libs/wallet';
import { governanceChain } from 'libs/wallet';
import { callOrThrow } from 'utilities';
import { type GetVoteReceiptInput, type GetVoteReceiptOutput, getVoteReceipt } from '.';

type TrimmedGetVoteReceiptInput = Omit<
  GetVoteReceiptInput,
  'publicClient' | 'governorBravoDelegateAddress'
>;

type Options = QueryObserverOptions<
  GetVoteReceiptOutput,
  Error,
  GetVoteReceiptOutput,
  GetVoteReceiptOutput,
  [FunctionKey.GET_VOTE_RECEIPT, TrimmedGetVoteReceiptInput]
>;

export const useGetVoteReceipt = (
  input: TrimmedGetVoteReceiptInput,
  options?: Partial<Options>,
) => {
  const { accountAddress } = input;
  const { publicClient } = usePublicClient();
  const governorBravoDelegateAddress = getGovernorBravoDelegateContractAddress({
    chainId: governanceChain.id,
  });

  return useQuery({
    queryKey: [FunctionKey.GET_VOTE_RECEIPT, input],
    queryFn: () =>
      callOrThrow({ governorBravoDelegateAddress }, params =>
        getVoteReceipt({ ...params, ...input, publicClient }),
      ),
    enabled:
      (options?.enabled === undefined || options?.enabled) &&
      // Check user have connected their wallet
      accountAddress !== undefined &&
      !!governorBravoDelegateAddress,
  });
};
