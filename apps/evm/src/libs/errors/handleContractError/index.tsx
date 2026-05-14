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
  displayNotification({
    variant: 'error',
    autoClose: false,
    description: (
      <ContractErrorNotice
        friendlyPhrase={getFriendlyPhrase(parsed)}
        errorName={parsed.errorName}
        signature={parsed.signature}
        rawMessage={error.message}
      />
    ),
  });
  logError(error);
};

const getFriendlyPhrase = (parsed: ParsedContractError): string | undefined => {
  const firstArg = parsed.args?.[0];
  const isLegacyStringRevert = parsed.errorName === 'Error' && typeof firstArg === 'string';
  const legacyReason = isLegacyStringRevert ? firstArg : undefined;
  return legacyReason ?? customErrorPhrases[parsed.errorName];
};
