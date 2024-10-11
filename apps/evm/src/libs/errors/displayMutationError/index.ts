import { displayNotification } from 'libs/notifications';

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

    if (error.code === 'gaslessTransactionNotAvailable' && error.errorCallback) {
      error.errorCallback();
      return;
    }
  }

  displayNotification({
    variant: 'error',
    description: message,
  });
};
