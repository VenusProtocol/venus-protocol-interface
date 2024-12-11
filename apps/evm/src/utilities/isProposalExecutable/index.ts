import { isBefore } from 'date-fns/isBefore';

export type IsProposalExecutableInput = {
  now: Date;
  isQueued: boolean;
  executionEtaDate?: Date;
};

export const isProposalExecutable = ({
  now,
  isQueued,
  executionEtaDate,
}: IsProposalExecutableInput) =>
  isQueued && !!(executionEtaDate && isBefore(executionEtaDate, now));
