import { VError, VErrorPhraseMap, logError } from 'libs/errors';

import { NonNullableFields } from 'types';

function callOrThrow<TParams extends Record<string, unknown>, TReturn>(
  params: TParams,
  callback: (sanitizedParams: NonNullableFields<TParams>) => TReturn,
  errorCodeOnThrow: VErrorPhraseMap['unexpected'] = 'couldNotRetrieveSigner',
): TReturn {
  // Throw if a param is undefined or null
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      logError(`Required parameter ${key} cannot be null or undefined`);
      throw new VError({ type: 'unexpected', code: errorCodeOnThrow });
    }
  });

  return callback(params as NonNullableFields<TParams>);
}

export default callOrThrow;
