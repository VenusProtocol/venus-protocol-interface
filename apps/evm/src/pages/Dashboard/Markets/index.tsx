import { useGetPool } from 'clients/api';
import { Spinner } from 'components';
import { useChain } from 'hooks/useChain';
import { useAccountAddress } from 'libs/wallet';
import { Tabs } from './Tabs';

export const Markets: React.FC = () => {
  const { accountAddress } = useAccountAddress();
  const { corePoolComptrollerContractAddress } = useChain();

  const { data: getPoolData } = useGetPool({
    poolComptrollerAddress: corePoolComptrollerContractAddress,
    accountAddress,
  });
  const pool = getPoolData?.pool;

  if (!pool) {
    return <Spinner />;
  }

  return <Tabs pool={pool} />;
};
