import { useGetVaults } from 'clients/api';
import { Page, Spinner } from 'components';
import { useAccountAddress } from 'libs/wallet';

import { VaultList } from './VaultList';
import { useSortVaults } from './useSortVaults';

const VaultsPage: React.FC = () => {
  const { accountAddress } = useAccountAddress();
  const { data: vaults, isLoading: isGetVaultsLoading } = useGetVaults({
    accountAddress,
  });

  // Sort vaults
  const sortedVaults = useSortVaults({
    vaults,
  });

  if (isGetVaultsLoading || sortedVaults.length === 0) {
    return <Spinner />;
  }

  return (
    <Page>
      <VaultList vaults={sortedVaults} />
    </Page>
  );
};

export default VaultsPage;
