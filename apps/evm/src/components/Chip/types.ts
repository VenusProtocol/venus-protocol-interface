import type { ProposalType } from 'types';

import type { IconName } from '../Icon';

export type ChipType = 'default' | 'active' | 'inactive' | 'blue' | 'error';

export interface ChipProps {
  text: string;
  type?: ChipType;
  className?: string;
  iconName?: IconName;
}

export interface ProposalTypeChipProps extends Omit<ChipProps, 'icon' | 'type' | 'text'> {
  proposalType: ProposalType.FAST_TRACK | ProposalType.CRITICAL;
}
