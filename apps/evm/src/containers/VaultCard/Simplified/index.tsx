import { cn } from '@venusprotocol/ui';
import BigNumber from 'bignumber.js';

import { Card, TokenIcon, TokenIconWithSymbol } from 'components';
import { HidableUserBalance } from 'containers/HidableUserBalance';
import { StatusLabel } from 'containers/VaultCard/StatusLabel';
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

import { InstitutionalVaultModal } from 'containers/VaultCard/InstitutionalVaultModal';
import { PendleVaultModal } from 'containers/VaultCard/PendleVaultModal';
import { VenusVaultModal } from 'containers/VenusVaultModal';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { Cell } from './Cell';

interface VaultCardSimplifiedProps {
  vault: Vault;
  className?: string;
}

// Vault Card in Dashboard
export const VaultCardSimplified: React.FC<VaultCardSimplifiedProps> = ({ vault, className }) => {
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
    <>
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
    </>
  ) : undefined;

  // Bottom-right cell content (state end date / emission), which varies per vault type and mirrors
  // what the vault page shows. Right-aligned per design.
  let stateEndTitle: ReactNode;
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

  return (
    <>
      <Card
        className={cn(
          'w-full h-full flex flex-col p-3 gap-3 duration-200',
          !isPaused && 'cursor-pointer hover:border-blue',
          className,
        )}
        onClick={isPaused ? undefined : showModal}
      >
        <div className="flex items-start justify-between gap-2">
          {showHoldingsCard ? (
            <div className="min-w-0 text-b1r text-light-grey">
              {t('vault.card.currentDeposited')}
              <div
                className={cn('flex items-center text-p2s gap-2 text-light-grey-active min-w-0')}
              >
                <TokenIcon
                  token={displayToken}
                  displayChain={false}
                  size="lg"
                  className="shrink-0"
                />
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
          )}

          <StatusLabel status={vault.status} className="shrink-0" />
        </div>

        <div className="flex gap-2">
          <Cell
            title={t('vault.card.apr')}
            content={formatPercentageToReadableValue(vault.stakeAprPercentage)}
          />

          {showHoldingsCard
            ? stateEndContent && (
                <Cell
                  className="text-right"
                  contentClassName="justify-end"
                  title={stateEndTitle}
                  content={stateEndContent}
                />
              )
            : totalDepositedReadableValue && (
                <Cell
                  className="text-right"
                  contentClassName="justify-end"
                  title={t('vault.card.totalDeposited')}
                  content={totalDepositedReadableValue}
                />
              )}
        </div>
      </Card>

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
