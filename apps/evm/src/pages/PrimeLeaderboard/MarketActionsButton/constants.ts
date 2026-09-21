import type { IconName } from 'components';

import type { PrimeRewardSide } from '../UserRewardsCard';

export const CTA_BY_SIDE = {
  supply: { iconName: 'vaultArrowDown', tabId: 'supply' },
  borrow: { iconName: 'vaultArrowUp', tabId: 'borrow' },
  both: { iconName: 'vaultArrowUpDown', tabId: 'supply' },
} as const satisfies Record<PrimeRewardSide, { iconName: IconName; tabId: string }>;
