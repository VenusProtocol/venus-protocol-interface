import { useGetIsolatedPools } from 'clients/api';
import { PoolStats } from 'containers/PoolStats';
import PoolTable from './PoolTable';

const IsolatedPools: React.FC = () => {
  const { data: getPoolsData } = useGetIsolatedPools();
  const isolatedPools = getPoolsData?.pools || [];

  return (
    <>
      <PoolStats
        className="mb-6 xxl:mb-8"
        pools={isolatedPools}
        stats={['supply', 'borrow', 'liquidity', 'treasury']}
      />

      <PoolTable />
    </>
  );
};

export default IsolatedPools;
