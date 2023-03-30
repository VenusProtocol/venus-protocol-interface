import { useMemo } from 'react';
import { FormatTokensToReadableValueInput, formatTokensToReadableValue } from 'utilities';

import PLACEHOLDER_KEY from 'constants/placeholderKey';

export type UseFormatTokensToReadableValueInput = FormatTokensToReadableValueInput;

const useFormatTokensToReadableValue = (params: UseFormatTokensToReadableValueInput) =>
  useMemo(
    () => (params.value ? formatTokensToReadableValue(params) : PLACEHOLDER_KEY),
    Object.values(params),
  );

export default useFormatTokensToReadableValue;
