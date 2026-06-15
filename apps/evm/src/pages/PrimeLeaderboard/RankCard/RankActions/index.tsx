import { Button, ButtonWrapper } from '@venusprotocol/ui';
import { useState } from 'react';

import { Icon } from 'components';
import { routes } from 'constants/routing';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';

import { RulesModal } from '../../RulesModal';

export const RankActions: React.FC = () => {
  const { t } = useTranslation();
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);

  return (
    <>
      <div className="flex gap-x-2.5">
        <ButtonWrapper asChild className="flex-1">
          <Link to={routes.vaults.path}>{t('primeLeaderboard.rankCard.stakeButton')}</Link>
        </ButtonWrapper>

        <Button variant="secondary" className="flex-1" onClick={() => setIsRulesModalOpen(true)}>
          <div className="flex items-center gap-x-2">
            <Icon name="graduationCap" className="size-5" />
            {t('primeLeaderboard.rankCard.rulesButton')}
          </div>
        </Button>
      </div>

      {isRulesModalOpen && <RulesModal isOpen handleClose={() => setIsRulesModalOpen(false)} />}
    </>
  );
};
