import { useGetPool } from 'clients/api';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import type { Address } from 'viem';

export interface PoolNameProps {
  poolComptrollerAddress: Address;
}

const PoolName: React.FC<PoolNameProps> = ({ poolComptrollerAddress }) => {
  const { data: getPools } = useGetPool({
    poolComptrollerAddress,
  });

  return <>{getPools?.pool?.name || PLACEHOLDER_KEY}</>;
};

export default PoolName;
