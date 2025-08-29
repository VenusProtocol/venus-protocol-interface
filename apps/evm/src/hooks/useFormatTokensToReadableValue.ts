import {
  type FormatTokensToReadableValueInput,
  formatTokensToReadableValue,
} from '@venusprotocol/ui';
import { useMemo } from 'react';

import PLACEHOLDER_KEY from 'constants/placeholderKey';

export type UseFormatTokensToReadableValueInput = FormatTokensToReadableValueInput;

const useFormatTokensToReadableValue = (params: UseFormatTokensToReadableValueInput) =>
  useMemo(() => (params.value ? formatTokensToReadableValue(params) : PLACEHOLDER_KEY), [params]);

export default useFormatTokensToReadableValue;
