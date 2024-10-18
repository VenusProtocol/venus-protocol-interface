import type { ErrorCodes, VError, VErrorParamMap, VErrorPhraseMap } from '../VError';
import { importProposalErrorPhrases } from '../importProposalErrorPhrases';
import { interactionErrorPhrases } from '../interactionErrorPhrases';
import { transactionErrorPhrases } from '../transactionErrorPhrases';
import { unexpectedErrorPhrases } from '../unexpectedErrorPhrases';

export const formatVErrorToReadableString = (error: VError<ErrorCodes>) => {
  let phrase = unexpectedErrorPhrases.somethingWentWrong;
  if (error.type === 'transaction') {
    const message = transactionErrorPhrases[error.message as VErrorPhraseMap['transaction']];
    const info = transactionErrorPhrases[(error.data as VErrorParamMap['transaction']).info];
    phrase = `${message} - ${info}`;
  } else if (error.type === 'unexpected') {
    phrase = unexpectedErrorPhrases[error.message as VErrorPhraseMap['unexpected']];
  } else if (error.type === 'interaction') {
    const translationPhrase = interactionErrorPhrases[error.code as VErrorPhraseMap['interaction']];
    if (typeof translationPhrase === 'function') {
      if (error.data) {
        phrase = translationPhrase(error.data as VErrorParamMap['interaction']);
      }
    } else {
      phrase = translationPhrase;
    }
  } else if (error.type === 'proposal') {
    const message = importProposalErrorPhrases[error.message as VErrorPhraseMap['proposal']];
    const { info } = error.data ? (error.data as VErrorParamMap['proposal']) : { info: '' };
    phrase = info ? `${message} - ${info}` : message;
  }
  return phrase || unexpectedErrorPhrases.somethingWentWrong;
};
