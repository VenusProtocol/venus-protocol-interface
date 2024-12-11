import { useNow } from 'hooks/useNow';
import { useMemo } from 'react';
import { isProposalExecutable } from 'utilities/isProposalExecutable';

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
    () =>
      isProposalExecutable({
        executionEtaDate,
        isQueued,
        now,
      }),
    [executionEtaDate, isQueued, now],
  );

  return {
    isExecutable,
  };
};
