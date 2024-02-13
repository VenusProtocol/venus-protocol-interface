import { useAccountAddress } from 'libs/wallet';

import { useGetPool } from 'clients/api';
import PLACEHOLDER_KEY from 'constants/placeholderKey';

export interface PoolNameProps {
  poolComptrollerAddress: string;
}

const PoolName: React.FC<PoolNameProps> = ({ poolComptrollerAddress }) => {
  const { accountAddress } = useAccountAddress();
  const { data: getPoolData } = useGetPool({
    accountAddress,
    poolComptrollerAddress,
  });

  return <>{getPoolData?.pool?.name || PLACEHOLDER_KEY}</>;
};

export default PoolName;
