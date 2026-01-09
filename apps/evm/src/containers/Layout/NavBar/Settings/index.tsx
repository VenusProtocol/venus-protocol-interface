import { chains } from 'libs/wallet/chains';

import { featureFlags } from 'hooks/useIsFeatureEnabled';
import { GaslessTransactionSetting } from './GaslessTransactionSetting';

const gasLessTransactionsChainIds = featureFlags.gaslessTransactions.filter(chain =>
  chains.some(c => c.id === chain),
);

export const Settings: React.FC = () => (
  <div className="space-y-6">
    {gasLessTransactionsChainIds.map(chainId => (
      <GaslessTransactionSetting chainId={chainId} />
    ))}
  </div>
);
