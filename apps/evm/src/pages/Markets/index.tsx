import { useParams } from 'react-router';
import type { Address } from 'viem';

import { useGetPool } from 'clients/api';
import { Page, Spinner } from 'components';
import { NULL_ADDRESS } from 'constants/address';
import { Redirect } from 'containers/Redirect';
import { useMarketsPagePath } from 'hooks/useMarketsPagePath';
import { useAccountAddress } from 'libs/wallet';
import { Header } from './Header';
import { Tabs } from './Tabs';

export const Markets: React.FC = () => {
  const { accountAddress } = useAccountAddress();
  const { marketsPagePath } = useMarketsPagePath();

  const { poolComptrollerAddress = NULL_ADDRESS } = useParams<{
    poolComptrollerAddress: Address;
  }>();

  const { data: getPoolData, isLoading: isGetPoolDataLoading } = useGetPool({
    accountAddress,
    poolComptrollerAddress,
  });
  const pool = getPoolData?.pool;

  // Redirect to home page if pool Comptroller address is incorrect
  if (!isGetPoolDataLoading && !pool) {
    return <Redirect to={marketsPagePath} />;
  }

  return (
    <Page>
      {pool ? (
        <div className="space-y-6 sm:space-y-12">
          <Header pool={pool} />

          <Tabs pool={pool} />
        </div>
      ) : (
        <Spinner />
      )}
    </Page>
  );
};

export default Markets;
