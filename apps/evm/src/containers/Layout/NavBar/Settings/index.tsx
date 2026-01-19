import { featureFlags } from 'hooks/useIsFeatureEnabled';
import { chains } from 'libs/wallet/chains';
import { GaslessTransactionSetting } from './GaslessTransactionSetting';
import { LanguageSetting } from './LanguageSetting';

const gasLessTransactionsChainIds = featureFlags.gaslessTransactions.filter(chain =>
  chains.some(c => c.id === chain),
);

export const Settings: React.FC = () => (
  <div className="space-y-6">
    <LanguageSetting />

    {gasLessTransactionsChainIds.map(chainId => (
      <GaslessTransactionSetting chainId={chainId} />
    ))}
  </div>
);
