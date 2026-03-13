/** @jsxImportSource @emotion/react */
import { useGetVaults } from 'clients/api';
import { Page, Spinner, cn } from 'components';
import { useAccountAddress } from 'libs/wallet';
import type { Vault } from 'types';

import { type ActiveModal, VaultModals } from 'containers/Vault';
import { useState } from 'react';
import { Overview } from './Overview';
import { Vaults } from './Vaults';

const StakingPage: React.FC = () => {
  const [activeModal, setActiveModal] = useState<ActiveModal | undefined>(undefined);
  const [activeVault, setActiveVault] = useState<Vault | undefined>(undefined);

  const openModal = (_vault: Vault, _activeModal?: ActiveModal) => {
    setActiveVault(_vault);
    setActiveModal(_activeModal);
  };

  const closeModal = () => {
    setActiveVault(undefined);
    setActiveModal(undefined);
  };

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
        <Overview vaults={vaults} onOpenModal={openModal} />

        <Vaults vaults={vaults} openModal={openModal} />
      </div>
      {activeVault && (
        <VaultModals vault={activeVault} activeModal={activeModal} onClose={closeModal} />
      )}
    </Page>
  );
};

export default StakingPage;
