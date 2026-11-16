import type { MarketMode } from '../../types';

export const toModeParam = (mode: MarketMode) => (mode === 'earn' ? undefined : mode);
