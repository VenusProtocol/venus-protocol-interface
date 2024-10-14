import { Page } from 'components';
import { PoolStats } from 'containers/PoolStats';
import PoolTable from './PoolTable';
import { useGetFilteredPools } from './useGetFilteredPools';

const IsolatedPools: React.FC = () => {
  const { pools } = useGetFilteredPools();

  return (
    <Page indexWithSearchEngines={false}>
      <PoolStats
        className="mb-6"
        pools={pools}
        stats={['supply', 'borrow', 'liquidity', 'treasury']}
      />

      <PoolTable />
    </Page>
  );
};

export default IsolatedPools;
