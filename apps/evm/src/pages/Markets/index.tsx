import { useParams } from 'react-router';
import type { Address } from 'viem';

import { useGetPool } from 'clients/api';
import { Page, Spinner, Wrapper } from 'components';
import { NULL_ADDRESS } from 'constants/address';
import { Redirect } from 'containers/Redirect';
import { useGetMarketsPagePath } from 'hooks/useGetMarketsPagePath';
import { useAccountAddress } from 'libs/wallet';
import { Header } from './Header';
import { MarketsAdBanner } from './MarketsAdBanner';
import { Tabs } from './Tabs';

export const Markets: React.FC = () => {
  const { accountAddress } = useAccountAddress();
  const { marketsPagePath } = useGetMarketsPagePath();

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
      <MarketsAdBanner />

      <Wrapper className="pt-5 sm:pt-10">
        {pool ? (
          <div className="space-y-6 sm:space-y-12">
            <Header pool={pool} />

            <Tabs pool={pool} />
          </div>
        ) : (
          <Spinner />
        )}
      </Wrapper>
    </Page>
  );
};

export default Markets;
