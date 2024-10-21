import { displayNotification } from 'libs/notifications';

import { VError } from '../VError';
import { formatVErrorToReadableString } from './formatVErrorToReadableString';

export interface HandleErrorInput {
  error: unknown;
}

export const handleError = ({ error }: HandleErrorInput) => {
  let { message } = error as Error;

  // TODO: detect if error was caused because user rejected the transaction and do nothing in this
  // case

  if (error instanceof VError) {
    message = formatVErrorToReadableString(error);
  }

  // Do nothing if error is about gasless transactions being unavailable, as in this case we display
  // an error modal instead
  if (error instanceof VError && error.code === 'gaslessTransactionNotAvailable') {
    return;
  }

  displayNotification({
    variant: 'error',
    description: message,
  });
};
