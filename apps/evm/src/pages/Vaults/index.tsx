import { useGetVaults } from 'clients/api';
import { Page, Spinner } from 'components';
import { useAccountAddress } from 'libs/wallet';

import { VaultList } from './VaultList';

const VaultsPage: React.FC = () => {
  const { accountAddress } = useAccountAddress();
  const { data: vaults, isLoading: isGetVaultsLoading } = useGetVaults({
    accountAddress,
  });

  if (isGetVaultsLoading || !vaults || vaults.length === 0) {
    return <Spinner />;
  }

  return (
    <Page>
      <VaultList vaults={vaults} />
    </Page>
  );
};

export default VaultsPage;
