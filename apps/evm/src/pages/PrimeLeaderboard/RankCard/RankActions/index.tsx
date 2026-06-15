import { Button } from '@venusprotocol/ui';
import { useState } from 'react';

import { Icon } from 'components';
import { useTranslation } from 'libs/translations';

import { RulesModal } from '../../RulesModal';
import { StakeXvsModal } from '../../StakeXvsModal';

export const RankActions: React.FC = () => {
  const { t } = useTranslation();
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);

  return (
    <>
      <div className="flex gap-x-2.5">
        <Button className="flex-1" onClick={() => setIsStakeModalOpen(true)}>
          {t('primeLeaderboard.rankCard.stakeButton')}
        </Button>

        <Button variant="secondary" className="flex-1" onClick={() => setIsRulesModalOpen(true)}>
          <div className="flex items-center gap-x-2">
            <Icon name="graduationCap" className="size-5" />
            {t('primeLeaderboard.rankCard.rulesButton')}
          </div>
        </Button>
      </div>

      {isRulesModalOpen && <RulesModal isOpen handleClose={() => setIsRulesModalOpen(false)} />}

      {isStakeModalOpen && <StakeXvsModal handleClose={() => setIsStakeModalOpen(false)} />}
    </>
  );
};
