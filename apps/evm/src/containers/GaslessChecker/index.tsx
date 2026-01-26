import { useGetPaymasterInfo } from 'clients/api';
import config from 'config';
import { featureFlags } from 'hooks/useIsFeatureEnabled';
import { ChainId } from 'types';

const GaslessChecker: React.FC = () => {
  // Prefetch paymaster info on ZKsync to check if gasless transactions are available. Note that we
  // only check for ZKsync as this is the only network that enables gasless transactions for now.
  useGetPaymasterInfo(
    {
      chainId: config.network === 'testnet' ? ChainId.ZKSYNC_SEPOLIA : ChainId.ZKSYNC_MAINNET,
    },
    {
      enabled: featureFlags.gaslessTransactions.length > 0,
    },
  );

  return null;
};

export default GaslessChecker;
