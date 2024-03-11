import { type QueryObserverOptions, useQuery } from 'react-query';

import getXvsVaultLockedDeposits, {
  type GetXvsVaultLockedDepositsInput,
  type GetXvsVaultLockedDepositsOutput,
} from 'clients/api/queries/getXvsVaultLockedDeposits';
import FunctionKey from 'constants/functionKey';
import { useGetXvsVaultContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';

type TrimmedGetXvsVaultLockedDepositsInput = Omit<
  GetXvsVaultLockedDepositsInput,
  'xvsVaultContract'
>;

export type UseGetXvsVaultLockedDepositsQueryKey = [
  FunctionKey.GET_XVS_VAULT_WITHDRAWAL_REQUESTS,
  TrimmedGetXvsVaultLockedDepositsInput & {
    chainId: ChainId;
  },
];

type Options = QueryObserverOptions<
  GetXvsVaultLockedDepositsOutput,
  Error,
  GetXvsVaultLockedDepositsOutput,
  GetXvsVaultLockedDepositsOutput,
  UseGetXvsVaultLockedDepositsQueryKey
>;

const useGetXvsVaultLockedDeposits = (
  input: TrimmedGetXvsVaultLockedDepositsInput,
  options?: Options,
) => {
  const { chainId } = useChainId();
  const xvsVaultContract = useGetXvsVaultContract();

  return useQuery(
    [FunctionKey.GET_XVS_VAULT_WITHDRAWAL_REQUESTS, { ...input, chainId }],
    () =>
      callOrThrow({ xvsVaultContract }, params =>
        getXvsVaultLockedDeposits({ ...params, ...input }),
      ),
    options,
  );
};

export default useGetXvsVaultLockedDeposits;
