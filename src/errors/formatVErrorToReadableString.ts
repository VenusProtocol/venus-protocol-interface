import { unexpectedErrorPhrases } from 'errors/unexpectedErrorPhrases';
import { interactionErrorPhrases } from 'errors/interactionErrorPhrases';
import { transactionErrorPhrases } from 'errors/transactionErrorPhrases';
import { VError, ErrorCodes, IVErrorParamMap, IVErrorPhraseMap } from './VError';

export const formatVErrorToReadableString = (error: VError<ErrorCodes>) => {
  let phrase = unexpectedErrorPhrases.somethingWentWrong;
  if (error.type === 'transaction') {
    const message = transactionErrorPhrases[error.message as IVErrorPhraseMap['transaction']];
    const info = transactionErrorPhrases[(error.data as IVErrorParamMap['transaction']).info];
    phrase = `${message} - ${info}`;
  } else if (error.type === 'unexpected') {
    phrase = unexpectedErrorPhrases[error.message as IVErrorPhraseMap['unexpected']];
  } else if (error.type === 'interaction') {
    const translationPhrase =
      interactionErrorPhrases[error.code as IVErrorPhraseMap['interaction']];
    if (typeof translationPhrase === 'function') {
      if (error.data) {
        phrase = translationPhrase(error.data as IVErrorParamMap['interaction']);
      }
    } else {
      phrase = translationPhrase;
    }
  }
  return phrase || unexpectedErrorPhrases.somethingWentWrong;
};
