import { Button, ButtonWrapper } from '@venusprotocol/ui';
import { useState } from 'react';

import { Icon } from 'components';
import { routes } from 'constants/routing';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';

import { LastCycleSummaryModal } from '../../LastCycleSummaryModal';

export const RankActions: React.FC = () => {
  const { t } = useTranslation();
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);

  return (
    <>
      <div className="flex gap-x-2.5">
        <ButtonWrapper asChild className="flex-1">
          <Link to={routes.vaults.path}>{t('primeLeaderboard.rankCard.stakeButton')}</Link>
        </ButtonWrapper>

        <Button variant="secondary" className="flex-1" onClick={() => setIsSummaryModalOpen(true)}>
          <div className="flex items-center gap-x-2">
            <Icon name="graduationCap" className="size-5" />
            {t('primeLeaderboard.rankCard.rulesButton')}
          </div>
        </Button>
      </div>

      {isSummaryModalOpen && (
        <LastCycleSummaryModal isOpen handleClose={() => setIsSummaryModalOpen(false)} />
      )}
    </>
  );
};
