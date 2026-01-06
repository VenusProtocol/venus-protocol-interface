import { Card, Icon, Toggle } from 'components';
import { useChain } from 'hooks/useChain';
import { useUserChainSettings } from 'hooks/useUserChainSettings';
import { useTranslation } from 'libs/translations';

export const Settings: React.FC = () => {
  const { t } = useTranslation();
  const { name: chainName } = useChain();

  const [userChainSettings, setUserChainSettings] = useUserChainSettings();
  const isGaslessTransactionsUserSettingEnabled = userChainSettings.gaslessTransactions;

  const toggleGaslessTransactions = () =>
    setUserChainSettings({
      gaslessTransactions: !isGaslessTransactionsUserSettingEnabled,
    });

  return (
    <Card className="py-1 pl-1 sm:py-1 sm:pl-1">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-background items-center justify-center flex shrink-0 w-12 h-12 sm:w-14 sm:h-14">
          <Icon name="gasSlashed" className="text-green w-8 h-8 sm:w-10 sm:h-10" />
        </div>

        <div className="flex grow items-center justify-between md:justify-normal gap-3">
          <p>
            {t('account.settings.gaslessTransactions.switchLabel', {
              chainName,
            })}
          </p>

          <Toggle
            onChange={toggleGaslessTransactions}
            value={isGaslessTransactionsUserSettingEnabled}
          />
        </div>
      </div>
    </Card>
  );
};
