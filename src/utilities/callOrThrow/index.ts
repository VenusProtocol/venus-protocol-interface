import { VError } from 'errors';
import { NonNullableFields } from 'types';

import { logError } from 'context/ErrorLogger';

function callOrThrow<TParams extends Record<string, unknown>, TReturn>(
  params: TParams,
  callback: (sanitizedParams: NonNullableFields<TParams>) => TReturn,
): TReturn {
  // Throw if a param is undefined or null
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      logError(`Required parameter ${key} cannot be null or undefined`);
      throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
    }
  });

  return callback(params as NonNullableFields<TParams>);
}

export default callOrThrow;
