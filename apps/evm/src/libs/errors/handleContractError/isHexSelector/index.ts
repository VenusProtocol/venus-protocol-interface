import type { Hex } from 'viem';

import { SELECTOR_LENGTH } from '../constants';

export const isHexSelector = (value: unknown): value is Hex =>
  typeof value === 'string' && value.startsWith('0x') && value.length >= SELECTOR_LENGTH;
