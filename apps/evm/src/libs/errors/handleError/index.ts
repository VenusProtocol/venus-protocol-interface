import { displayNotification } from 'libs/notifications';
import { VError } from '../VError';
import { isUserRejectedTxError } from '../isUserRejectedTxError';
import { logError } from '../logError';
import { unexpectedErrorPhrases } from '../unexpectedErrorPhrases';
import { formatVErrorToReadableString } from './formatVErrorToReadableString';

export interface HandleErrorInput {
  error: unknown;
}

export const handleError = ({ error }: HandleErrorInput) => {
  // Do nothing if error is due to user rejecting transaction
  if (isUserRejectedTxError({ error })) {
    return;
  }

  // Do nothing if error is about gasless transactions being unavailable, as in this case we display
  // an error modal instead
  if (error instanceof VError && error.code === 'gaslessTransactionNotAvailable') {
    return;
  }

  let message = unexpectedErrorPhrases.somethingWentWrong;

  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    message = error.message;
  }

  if (error instanceof VError) {
    message = formatVErrorToReadableString(error);
  }

  displayNotification({
    variant: 'error',
    description: message,
  });

  logError(error);
};
