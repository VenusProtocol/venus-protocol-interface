import { featureFlags } from 'hooks/useIsFeatureEnabled';
import { chains } from 'libs/wallet/chains';
import { GaslessTransactionSetting } from './GaslessTransactionSetting';
import { LanguageSetting } from './LanguageSetting';
import { ThemeSetting } from './ThemeSetting';

const gasLessTransactionsChainIds = featureFlags.gaslessTransactions.filter(chain =>
  chains.some(c => c.id === chain),
);

export const Settings: React.FC = () => (
  <div className="flex flex-col gap-y-3 [&>*]:min-h-12">
    <ThemeSetting />

    <LanguageSetting />

    {gasLessTransactionsChainIds.map(chainId => (
      <GaslessTransactionSetting chainId={chainId} />
    ))}
  </div>
);
