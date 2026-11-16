import { Button } from '@venusprotocol/ui';

import { Icon } from 'components';
import { useTranslation } from 'libs/translations';

export interface ConnectPromptProps {
  onConnect: () => void;
}

export const ConnectPrompt: React.FC<ConnectPromptProps> = ({ onConnect }) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex flex-1 flex-col items-center justify-center gap-y-1">
        <span className="flex size-10 items-center justify-center rounded-lg bg-neutral-hover">
          <Icon name="barChart" className="size-5 text-secondary" />
        </span>

        <p className="text-b1r text-secondary">{t('primeLeaderboard.rankCard.connectPrompt')}</p>
      </div>

      <Button className="w-full" onClick={onConnect}>
        {t('connectWallet.connectButton')}
      </Button>
    </>
  );
};
