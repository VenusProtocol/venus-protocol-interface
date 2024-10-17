import { useGetPaymasterInfo } from 'clients/api';
import config from 'config';
import { ChainId } from 'types';

const GaslessChecker: React.FC = () => {
  // Prefetch paymaster info on zkSync to check if gasless transactions are available. Note that we
  // only check for zkSync as this is the only network that enables gasless transactions for now.
  useGetPaymasterInfo({
    chainId: config.network === 'testnet' ? ChainId.ZKSYNC_SEPOLIA : ChainId.ZKSYNC_MAINNET,
  });

  return null;
};

export default GaslessChecker;
