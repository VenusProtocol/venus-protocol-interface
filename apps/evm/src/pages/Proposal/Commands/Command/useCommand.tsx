import { isBefore } from 'date-fns/isBefore';
import { useNow } from 'hooks/useNow';
import { useChainId } from 'libs/wallet';
import { useMemo } from 'react';
import { type ProposalCommand, ProposalCommandState } from 'types';

export type UseCommandProps = React.HTMLAttributes<HTMLDivElement> &
  Pick<ProposalCommand, 'chainId' | 'state' | 'executableAt' | 'failedExecutionAt' | 'executedAt'>;

export const useCommand = ({
  chainId,
  state,
  executableAt,
  failedExecutionAt,
  executedAt,
}: UseCommandProps) => {
  const { chainId: currentChainId } = useChainId();
  const now = useNow();

  const isExecutable = useMemo(
    () => state === ProposalCommandState.Queued && !!(executableAt && isBefore(executableAt, now)),
    [executableAt, state, now],
  );

  const hasFailedExecution = useMemo(
    () => !executedAt && !!failedExecutionAt,
    [failedExecutionAt, executedAt],
  );

  const isOnWrongChain = useMemo(() => currentChainId !== chainId, [currentChainId, chainId]);

  return {
    isExecutable,
    hasFailedExecution,
    isOnWrongChain,
  };
};
