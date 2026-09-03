import { useGetVaults } from 'clients/api';
import { Page, Spinner } from 'components';
import { useAccountAddress, useChainId } from 'libs/wallet';

import { useSortVaults } from 'hooks/useSortVaults';
import { VaultList } from './VaultList';
import { useResetFiltersOnChainChange } from './hooks/useResetFiltersOnChainChange';

const VaultsPage: React.FC = () => {
  const { accountAddress } = useAccountAddress();
  const { chainId } = useChainId();
  const { data: vaults, isLoading: isGetVaultsLoading } = useGetVaults({
    accountAddress,
  });

  useResetFiltersOnChainChange();

  // Sort vaults
  const sortedVaults = useSortVaults({
    vaults,
  });

  if (isGetVaultsLoading || sortedVaults.length === 0) {
    return <Spinner />;
  }

  return (
    <Page>
      {/* Remounting on chain change also clears the search field, which VaultList owns */}
      <VaultList key={chainId} vaults={sortedVaults} />
    </Page>
  );
};

export default VaultsPage;
