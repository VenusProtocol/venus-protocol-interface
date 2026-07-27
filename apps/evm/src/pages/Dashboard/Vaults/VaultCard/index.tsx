import BigNumber from 'bignumber.js';
import { type ReactNode, useState } from 'react';
import type { To } from 'react-router';

import { type CellProps, StatusLabel, TokenIcon, TokenIconWithSymbol } from 'components';
import { HidableUserBalance } from 'containers/HidableUserBalance';
import { InstitutionalVaultModal } from 'containers/VaultCard/InstitutionalVaultModal';
import { PendleVaultModal } from 'containers/VaultCard/PendleVaultModal';
import { VenusVaultModal } from 'containers/VenusVaultModal';
import useConvertMantissaToReadableTokenString from 'hooks/useConvertMantissaToReadableTokenString';
import { useNow } from 'hooks/useNow';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { Vault } from 'types';
import { VaultStatus } from 'types';
import {
  convertMantissaToTokens,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
  isInstitutionalVault,
  isLegacyVenusVault,
  isPendleVault,
} from 'utilities';
import { PreviewCard, type PreviewCardProps } from '../../PreviewCard';

interface VaultCardProps {
  vault: Vault;
  className?: string;
  to?: To;
}

export const VaultCard: React.FC<VaultCardProps> = ({ vault, className, to }) => {
  const { t } = useTranslation();
  const now = useNow();

  const [shouldShowModal, setShouldShowModal] = useState(false);

  const showModal = () => setShouldShowModal(true);
  const hideModal = () => setShouldShowModal(false);

  const { accountAddress } = useAccountAddress();
  const displayToken = isPendleVault(vault) ? vault.rewardToken : vault.stakedToken;

  const readableUserStakedTokens = useConvertMantissaToReadableTokenString({
    token: displayToken,
    value: vault.userStakeBalanceMantissa || new BigNumber(0),
    addSymbol: true,
  });

  const isPaused = ('isPaused' in vault && vault.isPaused) || vault.status === VaultStatus.Inactive;

  const canWithdraw = vault.userStakeBalanceMantissa?.gt(0);
  const showHoldingsCard = accountAddress && canWithdraw;

  const dailyEmissionReadableValue =
    'dailyEmissionMantissa' in vault && vault.dailyEmissionMantissa
      ? formatTokensToReadableValue({
          value: convertMantissaToTokens({
            value: vault.dailyEmissionMantissa,
            token: vault.rewardToken,
          }),
          token: vault.rewardToken,
        })
      : undefined;

  const totalDepositedReadableValue = vault.stakeBalanceMantissa ? (
    <div className="flex items-center justify-end gap-2 min-w-0">
      <TokenIcon token={displayToken} displayChain={false} size="md" className="shrink-0" />

      <span className="truncate min-w-0">
        {formatTokensToReadableValue({
          value: convertMantissaToTokens({
            value: vault.stakeBalanceMantissa,
            token: displayToken,
          }),
          token: displayToken,
        })}
      </span>
    </div>
  ) : undefined;

  let stateEndTitle: string | undefined;
  let stateEndContent: ReactNode;

  if (isPendleVault(vault)) {
    stateEndTitle = t('vault.card.maturityDatePendle');
    stateEndContent = t('vault.modals.textualDate', { date: vault.maturityDate });
  } else if (isInstitutionalVault(vault)) {
    let label = t('vault.card.maturityDate');
    let date = vault.maturityDate;
    let withCountdown = false;

    if (vault.status === VaultStatus.Refund) {
      label = t('vault.modals.institutionalTimeline.refundPeriod');
      date = vault.openEndDate;
    } else if (vault.status === VaultStatus.Deposit) {
      label = t('vault.modals.depositPeriodEnds');
      date = vault.openEndDate;
      withCountdown = true;
    } else if (vault.status === VaultStatus.Pending) {
      label = t('vault.modals.depositPeriodEnds');
      date = vault.openEndDate;
    } else if (vault.status === VaultStatus.Locked) {
      withCountdown = true;
    }

    const remainingDays = date
      ? Math.max(0, Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
      : 0;

    stateEndTitle =
      withCountdown && date
        ? `${label} ${t('vault.card.remainingDays', { count: remainingDays })}`
        : label;
    stateEndContent = date ? t('vault.modals.textualDate', { date }) : t('vault.timeline.tbd');
  } else if (dailyEmissionReadableValue) {
    stateEndTitle = t('vault.card.dailyEmission');
    stateEndContent = dailyEmissionReadableValue;
  }

  const cells: CellProps[] = [
    {
      label: t('dashboard.previewCard.apr'),
      value: formatPercentageToReadableValue(vault.stakeAprPercentage),
    },
  ];

  if (showHoldingsCard && stateEndContent && stateEndTitle) {
    cells.push({
      label: stateEndTitle,
      value: stateEndContent,
    });
  }

  if (!showHoldingsCard && totalDepositedReadableValue) {
    cells.push({
      label: t('dashboard.previewCard.totalSupplied'),
      value: totalDepositedReadableValue,
    });
  }

  const previewCardBaseProps = {
    className,
    header: showHoldingsCard ? (
      <div className="min-w-0 text-b1r text-light-grey">
        <span>{t('dashboard.previewCard.currentlySupplied')}</span>

        <div className="flex items-center text-p2s gap-2 text-light-grey-active min-w-0">
          <TokenIcon token={displayToken} displayChain={false} size="lg" className="shrink-0" />

          <span className="truncate min-w-0">
            <HidableUserBalance>{readableUserStakedTokens}</HidableUserBalance>
          </span>
        </div>
      </div>
    ) : (
      <TokenIconWithSymbol
        token={vault.stakedToken}
        displayChain={false}
        size="lg"
        className="min-w-0 text-p2s"
      />
    ),
    status: <StatusLabel status={vault.status} className="shrink-0" />,
    cells,
  };

  let previewCardProps: PreviewCardProps = previewCardBaseProps;

  if (!isPaused && showHoldingsCard) {
    previewCardProps = {
      ...previewCardBaseProps,
      onClick: showModal,
    };
  }

  if (!isPaused && !showHoldingsCard && to) {
    previewCardProps = {
      ...previewCardBaseProps,
      to,
    };
  }

  return (
    <>
      <PreviewCard {...previewCardProps} />

      {isPendleVault(vault) && (
        <PendleVaultModal vault={vault} isOpen={shouldShowModal} handleClose={hideModal} />
      )}

      {isLegacyVenusVault(vault) && (
        <VenusVaultModal vault={vault} isOpen={shouldShowModal} handleClose={hideModal} />
      )}

      {isInstitutionalVault(vault) && (
        <InstitutionalVaultModal vault={vault} isOpen={shouldShowModal} handleClose={hideModal} />
      )}
    </>
  );
};
