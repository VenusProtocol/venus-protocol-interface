import { useTranslation } from 'libs/translations';
import { ProposalType } from 'types';

import { Chip } from '../Chip';
import type { ProposalTypeChipProps } from '../types';

export const ProposalTypeChip: React.FC<ProposalTypeChipProps> = ({ proposalType, ...props }) => {
  const { t } = useTranslation();

  if (proposalType === ProposalType.FAST_TRACK) {
    return <Chip text={t('chip.proposalType.fastTrack')} iconName="lightning" {...props} />;
  }

  return <Chip text={t('chip.proposalType.critical')} iconName="fire" {...props} />;
};
