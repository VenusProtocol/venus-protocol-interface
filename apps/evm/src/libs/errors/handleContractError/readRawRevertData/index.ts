import type { BaseError, Hex } from 'viem';

import { isHexSelector } from '../isHexSelector';

export const readRawRevertData = (error: BaseError): Hex | undefined => {
  const layer = error.walk(e => isHexSelector((e as { data?: unknown } | null)?.data));
  const data = (layer as { data?: unknown } | null)?.data;
  return isHexSelector(data) ? data : undefined;
};
