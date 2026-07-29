import { useNow } from 'hooks/useNow';
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

  const isExecutable = isProposalExecutable({
    executionEtaDate,
    isQueued,
    now,
  });

  return {
    isExecutable,
  };
};
