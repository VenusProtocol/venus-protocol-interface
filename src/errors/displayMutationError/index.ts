import { displayNotification } from 'packages/notifications';

import { VError } from '../VError';
import { formatVErrorToReadableString } from './formatVErrorToReadableString';

export interface DisplayMutationErrorInput {
  error: unknown;
}

export const displayMutationError = ({ error }: DisplayMutationErrorInput) => {
  let { message } = error as Error;

  // TODO: detect if error was caused because user rejected the transaction and do nothing in this
  // case

  if (error instanceof VError) {
    message = formatVErrorToReadableString(error);
  }

  displayNotification({
    variant: 'error',
    description: message,
  });
};
