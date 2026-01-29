import { Icon } from 'components';

import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';
import { RewardGroupContent } from '../RewardGroupContent';
import type { ExternalRewardsGroup } from '../types';

export interface RewardGroupProps {
  group: ExternalRewardsGroup;
}

export const ExternalRewardGroup: React.FC<RewardGroupProps> = ({ group }) => {
  const { t } = useTranslation();

  return (
    <RewardGroupContent
      rightTitleComponent={
        <Link
          className="flex flex-row items-center"
          target="_blank"
          href={group.claimUrl}
          onClick={e => e.stopPropagation()}
        >
          {t('claimReward.modal.claimOn', { appName: group.appName })}
          <Icon className="text-blue" name="arrowRight" />
        </Link>
      }
      group={group}
    />
  );
};
