import { useGetPools } from 'clients/api';
import { Page } from 'components';
import { PoolStats } from 'containers/PoolStats';
import PoolTable from './PoolTable';

const IsolatedPools: React.FC = () => {
  const { data } = useGetPools();
  const pools = data?.pools || [];

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
