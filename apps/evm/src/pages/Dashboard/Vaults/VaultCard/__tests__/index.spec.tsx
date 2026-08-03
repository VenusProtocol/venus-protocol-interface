import { fireEvent, screen } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { assetData } from '__mocks__/models/asset';
import { institutionalVault, vaults } from '__mocks__/models/vaults';
import { useNow } from 'hooks/useNow';
import { en, t } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import type { InstitutionalVault, PendleVault, VenusVault } from 'types';
import { VaultCategory, VaultStatus, VaultType, VaultVenue } from 'types';
import {
  convertMantissaToTokens,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';
import { VaultCard } from '..';

const mockVenusVaultModal = vi.hoisted(() => vi.fn());
const mockPendleVaultModal = vi.hoisted(() => vi.fn());
const mockInstitutionalVaultModal = vi.hoisted(() => vi.fn());

vi.mock('hooks/useNow');

vi.mock('containers/VenusVaultModal', () => ({
  VenusVaultModal: (props: { isOpen: boolean }) => {
    mockVenusVaultModal(props);

    return props.isOpen ? <div data-testid="venus-vault-modal" /> : null;
  },
}));

vi.mock('containers/VaultCard/PendleVaultModal', () => ({
  PendleVaultModal: (props: { isOpen: boolean }) => {
    mockPendleVaultModal(props);

    return props.isOpen ? <div data-testid="pendle-vault-modal" /> : null;
  },
}));

vi.mock('containers/VaultCard/InstitutionalVaultModal', () => ({
  InstitutionalVaultModal: (props: { isOpen: boolean }) => {
    mockInstitutionalVaultModal(props);

    return props.isOpen ? <div data-testid="institutional-vault-modal" /> : null;
  },
}));

const venusVault = vaults[1];

const pendleVault: PendleVault = {
  ...vaults[0],
  asset: assetData[0],
  category: VaultCategory.YIELD_TOKENS,
  key: 'pendle-VAI-XVS-2026-06-25',
  liquidityCents: new BigNumber('742673002'),
  maturityDate: new Date('2026-06-25T00:00:00.000Z'),
  poolComptrollerContractAddress: '0x1111111111111111111111111111111111111111',
  poolName: 'Core Pool',
  stakeAprPercentage: 3.39809766,
  status: VaultStatus.Active,
  userStakeBalanceMantissa: new BigNumber('1000000000000000000'),
  vaultAddress: '0x2222222222222222222222222222222222222222',
  vaultType: VaultType.Pendle,
  venue: VaultVenue.Pendle,
  venueIconSrc: 'logoMobile',
};

const getReadableUserStake = (vault: VenusVault | PendleVault) =>
  formatTokensToReadableValue({
    value: convertMantissaToTokens({
      value: vault.userStakeBalanceMantissa || new BigNumber(0),
      token: vault.venue === VaultVenue.Pendle ? vault.rewardToken : vault.stakedToken,
    }),
    token: vault.venue === VaultVenue.Pendle ? vault.rewardToken : vault.stakedToken,
  });

describe('pages/Dashboard/Vaults/VaultCard', () => {
  beforeEach(() => {
    (useNow as Mock).mockReturnValue(new Date('2026-04-05T00:00:00.000Z'));
    mockVenusVaultModal.mockClear();
    mockPendleVaultModal.mockClear();
    mockInstitutionalVaultModal.mockClear();
  });

  it('renders vault token pair, APR, and total supplied when disconnected', () => {
    renderComponent(<VaultCard vault={vaults[0]} to="/vaults/vai" />);

    expect(screen.getByText(vaults[0].stakedToken.symbol)).toBeInTheDocument();
    expect(screen.getByText(en.dashboard.previewCard.apr)).toBeInTheDocument();
    expect(
      screen.getByText(formatPercentageToReadableValue(vaults[0].stakeAprPercentage)),
    ).toBeInTheDocument();
    expect(screen.getByText(en.dashboard.previewCard.totalSupplied)).toBeInTheDocument();
  });

  it('renders user stake and daily emission for connected Venus vaults', () => {
    renderComponent(<VaultCard vault={venusVault} />, { accountAddress: fakeAccountAddress });

    expect(screen.getByText(en.dashboard.previewCard.currentlySupplied)).toBeInTheDocument();
    expect(screen.getByText(getReadableUserStake(venusVault))).toBeInTheDocument();
    expect(screen.getByText(en.vault.card.dailyEmission)).toBeInTheDocument();
  });

  it('opens the Venus modal when clicking an active connected vault position', () => {
    renderComponent(<VaultCard vault={venusVault} />, { accountAddress: fakeAccountAddress });

    fireEvent.click(screen.getByText(en.dashboard.previewCard.currentlySupplied));

    expect(screen.getByTestId('venus-vault-modal')).toBeInTheDocument();
    expect(mockVenusVaultModal).toHaveBeenLastCalledWith(
      expect.objectContaining({
        isOpen: true,
        vault: venusVault,
      }),
    );
  });

  it('does not open the modal when the vault is paused', () => {
    const pausedVault = {
      ...venusVault,
      isPaused: true,
      status: VaultStatus.Paused,
    } satisfies VenusVault;

    renderComponent(<VaultCard vault={pausedVault} />, { accountAddress: fakeAccountAddress });

    fireEvent.click(screen.getByText(en.dashboard.previewCard.currentlySupplied));

    expect(screen.queryByTestId('venus-vault-modal')).not.toBeInTheDocument();
    expect(mockVenusVaultModal).toHaveBeenLastCalledWith(
      expect.objectContaining({
        isOpen: false,
      }),
    );
  });

  it('renders Pendle maturity date and opens the Pendle modal', () => {
    renderComponent(<VaultCard vault={pendleVault} />, { accountAddress: fakeAccountAddress });

    expect(screen.getByText(en.vault.card.targetApr)).toBeInTheDocument();
    expect(screen.getByText(en.vault.card.maturityDatePendle)).toBeInTheDocument();
    expect(
      screen.getByText(t('vault.modals.textualDate', { date: pendleVault.maturityDate })),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText(en.dashboard.previewCard.currentlySupplied));

    expect(screen.getByTestId('pendle-vault-modal')).toBeInTheDocument();
  });

  it('renders institutional deposit period and opens the institutional modal', () => {
    const depositVault = {
      ...institutionalVault,
      status: VaultStatus.Deposit,
    } satisfies InstitutionalVault;

    renderComponent(<VaultCard vault={depositVault} />, { accountAddress: fakeAccountAddress });

    expect(
      screen.getByText(
        `${en.vault.modals.depositPeriodEnds} ${t('vault.card.remainingDays', { count: 3 })}`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(t('vault.modals.textualDate', { date: depositVault.openEndDate })),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText(en.dashboard.previewCard.currentlySupplied));

    expect(screen.getByTestId('institutional-vault-modal')).toBeInTheDocument();
    expect(mockInstitutionalVaultModal).toHaveBeenLastCalledWith(
      expect.objectContaining({
        isOpen: true,
        vault: depositVault,
      }),
    );
  });
});
