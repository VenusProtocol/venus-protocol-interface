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
      <div className="grid grid-cols-2 gap-x-2.5">
        <Button
          className="w-full min-w-0 overflow-hidden whitespace-nowrap px-6"
          onClick={() => setIsStakeModalOpen(true)}
        >
          {t('primeLeaderboard.rankCard.stakeButton')}
        </Button>

        <Button
          variant="secondary"
          className="w-full min-w-0 overflow-hidden whitespace-nowrap"
          onClick={() => setIsRulesModalOpen(true)}
        >
          <div className="flex items-center gap-x-2">
            <Icon name="graduationCap" className="size-5 shrink-0" />
            {t('primeLeaderboard.rankCard.rulesButton')}
          </div>
        </Button>
      </div>

      {isRulesModalOpen && <RulesModal isOpen handleClose={() => setIsRulesModalOpen(false)} />}

      {isStakeModalOpen && <StakeXvsModal handleClose={() => setIsStakeModalOpen(false)} />}
    </>
  );
};
