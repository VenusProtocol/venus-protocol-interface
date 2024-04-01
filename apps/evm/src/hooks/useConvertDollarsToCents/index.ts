import { useMemo } from 'react';

import type BigNumber from 'bignumber.js';
import { convertDollarsToCents } from 'utilities';

export interface UseConvertDollarsToCentsInput {
  value: BigNumber;
}

export const useConvertDollarsToCents = (params: UseConvertDollarsToCentsInput) =>
  useMemo(() => convertDollarsToCents(params.value), [params]);
