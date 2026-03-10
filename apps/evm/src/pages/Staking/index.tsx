import BigNumber from 'bignumber.js';
/** @jsxImportSource @emotion/react */
import { useGetVaults } from 'clients/api';
import { Page, Spinner, cn } from 'components';
import { useAccountAddress } from 'libs/wallet';
import type { Vault } from 'types';

import { PLACEHOLDER_KEY } from 'constants/placeholders';
import { type ActiveModal, VaultModals } from 'containers/Vault';
import { useGetToken } from 'libs/tokens';
import { useState } from 'react';
import { areTokensEqual } from 'utilities';
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

  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const { accountAddress } = useAccountAddress();
  const { data: vaults, isLoading: isGetVaultsLoading } = useGetVaults({
    accountAddress,
  });

  if (isGetVaultsLoading || vaults.length === 0 || !vaults) {
    return <Spinner />;
  }

  const vaultWithHighestApr = vaults.sort(
    (a, b) => b.stakingAprPercentage - a.stakingAprPercentage,
  )[0];

  const featuredVault =
    vaults.find(vault => xvs && areTokensEqual(vault.stakedToken, xvs)) ?? vaultWithHighestApr;

  const totalStakedUsdCents = (vaults ?? []).reduce((accu, curr) => {
    const newVal = accu.plus(curr.totalStakedUsdCents);
    return newVal;
  }, new BigNumber(0));

  return (
    <Page>
      <div className={cn('flex flex-col gap-6 sm:gap-12')}>
        <Overview
          totalStakedUsdCents={totalStakedUsdCents}
          highestApr={vaultWithHighestApr.stakingAprPercentage}
          featuredVault={featuredVault}
          onOpenModal={openModal}
          totalVault={vaults?.length ?? PLACEHOLDER_KEY}
        />

        <Vaults vaults={vaults} openModal={openModal} />
      </div>
      {activeVault && (
        <VaultModals vault={activeVault} activeModal={activeModal} onClose={closeModal} />
      )}
    </Page>
  );
};

export default StakingPage;
