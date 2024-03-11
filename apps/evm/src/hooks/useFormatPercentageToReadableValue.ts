import type BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { formatPercentageToReadableValue } from 'utilities';

export interface UseFormatPercentageToReadableValueInput {
  value: number | string | BigNumber | undefined;
}

const useFormatPercentageToReadableValue = (params: UseFormatPercentageToReadableValueInput) =>
  useMemo(() => formatPercentageToReadableValue(params.value), [params.value]);

export default useFormatPercentageToReadableValue;
