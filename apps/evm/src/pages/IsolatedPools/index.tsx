import { PoolStats } from 'containers/PoolStats';
import PoolTable from './PoolTable';
import { useGetFilteredPools } from './useGetFilteredPools';

const IsolatedPools: React.FC = () => {
  const { pools } = useGetFilteredPools();

  return (
    <>
      <PoolStats
        className="mb-6 xxl:mb-8"
        pools={pools}
        stats={['supply', 'borrow', 'liquidity', 'treasury']}
      />

      <PoolTable />
    </>
  );
};

export default IsolatedPools;
