import { useGetVaults } from 'clients/api';
import { Page, Spinner, cn } from 'components';
import { useAccountAddress } from 'libs/wallet';

import { Overview } from './Overview';
import { Vaults } from './Vaults';

const StakingPage: React.FC = () => {
  const { accountAddress } = useAccountAddress();
  const { data: vaults, isLoading: isGetVaultsLoading } = useGetVaults({
    accountAddress,
  });

  if (isGetVaultsLoading || !vaults || vaults.length === 0) {
    return <Spinner />;
  }

  return (
    <Page>
      <div className={cn('flex flex-col gap-6 sm:gap-12')}>
        <Overview vaults={vaults} />

        <Vaults vaults={vaults} />
      </div>
    </Page>
  );
};

export default StakingPage;
