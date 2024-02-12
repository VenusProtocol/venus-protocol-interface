import { useMemo } from 'react';

import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { FormatTokensToReadableValueInput, formatTokensToReadableValue } from 'utilities';

export type UseFormatTokensToReadableValueInput = FormatTokensToReadableValueInput;

const useFormatTokensToReadableValue = (params: UseFormatTokensToReadableValueInput) =>
  useMemo(() => (params.value ? formatTokensToReadableValue(params) : PLACEHOLDER_KEY), [params]);

export default useFormatTokensToReadableValue;
