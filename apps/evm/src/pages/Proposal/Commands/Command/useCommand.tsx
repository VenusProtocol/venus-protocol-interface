import { isBefore } from 'date-fns/isBefore';
import { useNow } from 'hooks/useNow';
import { useChainId } from 'libs/wallet';
import { useMemo } from 'react';
import { type RemoteProposal, RemoteProposalState } from 'types';

export type UseCommandProps = React.HTMLAttributes<HTMLDivElement> &
  Pick<RemoteProposal, 'chainId' | 'state' | 'executionEtaDate'>;

export const useCommand = ({ chainId, state, executionEtaDate }: UseCommandProps) => {
  const { chainId: currentChainId } = useChainId();
  const now = useNow();

  const isExecutable = useMemo(
    () =>
      state === RemoteProposalState.Queued &&
      !!(executionEtaDate && isBefore(executionEtaDate, now)),
    [executionEtaDate, state, now],
  );

  const isOnWrongChain = useMemo(() => currentChainId !== chainId, [currentChainId, chainId]);

  return {
    isExecutable,
    isOnWrongChain,
  };
};
