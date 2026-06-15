import { Button, ButtonWrapper } from '@venusprotocol/ui';

import { Icon } from 'components';
import { routes } from 'constants/routing';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';

export const RankActions: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex gap-x-2.5">
      <ButtonWrapper asChild className="flex-1">
        <Link to={routes.vaults.path}>{t('primeLeaderboard.rankCard.stakeButton')}</Link>
      </ButtonWrapper>

      <Button variant="secondary" className="flex-1">
        <div className="flex items-center gap-x-2">
          <Icon name="graduationCap" className="size-5" />
          {t('primeLeaderboard.rankCard.rulesButton')}
        </div>
      </Button>
    </div>
  );
};
