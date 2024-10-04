import { isBefore } from 'date-fns/isBefore';
import { useNow } from 'hooks/useNow';
import { useMemo } from 'react';

export type UseIsProposalExecutableProps = {
  executionEtaDate?: Date;
  isQueued: boolean;
};

export const useIsProposalExecutable = ({
  isQueued,
  executionEtaDate,
}: UseIsProposalExecutableProps) => {
  const now = useNow();

  const isExecutable = useMemo(
    () => isQueued && !!(executionEtaDate && isBefore(executionEtaDate, now)),
    [executionEtaDate, isQueued, now],
  );

  return {
    isExecutable,
  };
};
