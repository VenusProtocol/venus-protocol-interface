import type { BaseError } from 'viem';

import { displayNotification } from 'libs/notifications';

import { ContractErrorNotice } from '../ContractErrorNotice';
import { customErrorPhrases } from '../customErrorPhrases';
import { logError } from '../logError';
import type { ParsedContractError } from './parseContractError';

export interface HandleContractErrorInput {
  error: BaseError;
  parsed: ParsedContractError;
}

export const handleContractError = ({ error, parsed }: HandleContractErrorInput) => {
  const firstArg = parsed.args?.[0];
  const friendlyPhrase =
    parsed.errorName === 'Error' && typeof firstArg === 'string'
      ? firstArg
      : customErrorPhrases[parsed.errorName];

  displayNotification({
    variant: 'error',
    autoClose: false,
    description: (
      <ContractErrorNotice
        friendlyPhrase={friendlyPhrase}
        errorName={parsed.errorName}
        signature={parsed.signature}
        rawMessage={error.message}
      />
    ),
  });
  logError(error);
};
