import { cn } from '@venusprotocol/ui';
import { useState } from 'react';

import { Card, Icon, InfoIcon, LabeledInlineContent, NoticeWarning } from 'components';
import { CopyAddressButton } from 'containers/CopyAddressButton';
import useConvertMantissaToReadableTokenString from 'hooks/useConvertMantissaToReadableTokenString';
import { useNow } from 'hooks/useNow';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { type Vault, VaultManager, VaultStatus } from 'types';
import {
  convertMantissaToTokens,
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
  isLegacyVenusVault,
  isPendleVault,
} from 'utilities';
import { LegacyVaultModal } from './LegacyVaultModal';
import { PendleVaultModal } from './PendleVaultModal';
import { StatusLabel } from './StatusLabel';
import { TokenIconWithPeriod } from './TokenIconWithPeriod';
import TEST_IDS from './testIds';

export interface VaultProps {
  vault: Vault;
  className?: string;
}

export const VaultCard: React.FC<VaultProps> = ({ vault, className }) => {
  const { t } = useTranslation();
  const now = useNow();

  const [modalVisible, setModalVisible] = useState(false);

  const { accountAddress } = useAccountAddress();

  const readableUserStakedTokens = vault?.userStakedMantissa?.gt(0)
    ? useConvertMantissaToReadableTokenString({
        token: isPendleVault(vault) ? vault.rewardToken : vault.stakedToken,
        value: vault.userStakedMantissa,
      })
    : undefined;

  const dailyEmissionMantissa =
    'dailyEmissionMantissa' in vault ? vault.dailyEmissionMantissa : undefined;
  const dailyEmissionCents = 'dailyEmissionCents' in vault ? vault.dailyEmissionCents : undefined;

  // PT Token
  const liquidityCents = 'liquidityCents' in vault ? vault.liquidityCents : undefined;
  const liquidityTokens = liquidityCents
    ? liquidityCents?.div(
        isPendleVault(vault) ? vault.rewardTokenPriceCents : vault.stakedTokenPriceCents,
      )
    : undefined;

  const hasMatured =
    'maturityDate' in vault && vault.maturityDate && now.getTime() > vault.maturityDate.getTime();

  const formattedMaturityDate =
    'maturityDate' in vault
      ? t('vault.card.textualWithTime', {
          date: vault.maturityDate,
        })
      : undefined;

  const clickAble = [
    VaultStatus.Active,
    VaultStatus.Earning,
    VaultStatus.Claim,
    ...(vault.manager === VaultManager.Pendle ? [VaultStatus.Deposit] : []),
  ].includes(vault.status);

  const openModal = () => {
    setModalVisible(true);
  };

  let footerLabel: string | undefined = t('vault.card.youDeposited');
  if (hasMatured) {
    footerLabel = t('vault.card.claimReward');
  } else if (isLegacyVenusVault(vault)) {
    footerLabel = t('vault.card.youStaked');
  }

  return (
    <>
      <Card
        className={cn(
          'w-full flex flex-col p-0 overflow-hidden duration-250',
          clickAble ? 'cursor-pointer hover:border-blue' : 'cursor-not-allowed',
          className,
        )}
        data-testid={TEST_IDS.userStakedTokens}
        onClick={clickAble ? openModal : undefined}
      >
        {/* Card body */}
        <div className={cn('bg-dark-blue p-3 sm:p-6 flex flex-col gap-4 sm:gap-6 flex-1')}>
          {/* Header */}
          <div className={cn('flex items-center justify-between')}>
            <div className={cn('flex items-center gap-x-3')}>
              <TokenIconWithPeriod
                token={vault.stakedToken}
                targetDate={'maturityDate' in vault ? vault.maturityDate : undefined}
                size="xl"
                data-testid={TEST_IDS.symbol}
              />

              {accountAddress && (
                <CopyAddressButton
                  className="shrink-0 text-light-grey"
                  address={vault.stakedToken?.address}
                />
              )}
            </div>

            <StatusLabel status={vault.status} />
          </div>

          {/* Stats */}
          <div className={cn('flex flex-col gap-y-4')}>
            <LabeledInlineContent label={t('vault.card.apr')} labelClassName="mb-auto">
              <span className="text-b1s">
                {formatPercentageToReadableValue(vault.stakingAprPercentage)}
              </span>
            </LabeledInlineContent>

            {liquidityCents && (
              <LabeledInlineContent
                label={t('vault.card.liquidity')}
                labelClassName="mb-auto"
                tooltip={t('vault.card.liquidityTooltip')}
              >
                <div className="text-b1r text-end">
                  <div className={cn('flex items-center')}>
                    {formatTokensToReadableValue({
                      value: liquidityTokens,
                      token: isPendleVault(vault) ? vault.rewardToken : vault.stakedToken,
                    })}
                    {isPendleVault(vault) && (
                      <InfoIcon
                        className="ml-2 inline-flex items-center"
                        tooltip={vault.rewardToken.fullSymbol}
                      />
                    )}
                  </div>
                  <div className="text-light-grey">
                    {formatCentsToReadableValue({
                      value: liquidityCents,
                    })}
                  </div>
                </div>
              </LabeledInlineContent>
            )}

            {dailyEmissionMantissa && (
              <LabeledInlineContent label={t('vault.card.dailyEmission')} labelClassName="mb-auto">
                <div className="text-b1r text-end">
                  <div className={cn('flex items-center gap-x-2')}>
                    {convertMantissaToTokens({
                      value: dailyEmissionMantissa,
                      token: vault.rewardToken,
                      returnInReadableFormat: true,
                      addSymbol: true,
                    })}
                  </div>
                  <div className="text-light-grey">
                    {formatCentsToReadableValue({
                      value: dailyEmissionCents,
                    })}
                  </div>
                </div>
              </LabeledInlineContent>
            )}

            <LabeledInlineContent label={t('vault.card.totalDeposited')} labelClassName="mb-auto">
              <div className="text-b1r text-end">
                <div className={cn('flex items-center gap-x-2')}>
                  {convertMantissaToTokens({
                    value: vault.totalStakedMantissa,
                    token: isPendleVault(vault) ? vault.rewardToken : vault.stakedToken,
                    returnInReadableFormat: true,
                    addSymbol: true,
                  })}
                </div>
                <div className="text-light-grey">
                  {formatCentsToReadableValue({
                    value: vault.totalStakedCents,
                  })}
                </div>
              </div>
            </LabeledInlineContent>

            {formattedMaturityDate && (
              <LabeledInlineContent
                label={t('vault.card.maturityDate')}
                labelClassName="mb-auto"
                tooltip={
                  vault.manager === VaultManager.Pendle
                    ? t('vault.card.maturityDatePendleTooltip')
                    : undefined
                }
              >
                <div className="text-b1r text-end">{formattedMaturityDate}</div>
              </LabeledInlineContent>
            )}

            <LabeledInlineContent label={t('vault.card.manager')} labelClassName="mb-auto">
              <Icon name={vault.managerIcon} />
              <span className="ms-2 text-b1r text-light-grey">{vault.manager?.toUpperCase()}</span>
            </LabeledInlineContent>
          </div>

          {/* Warnings */}
          {vault.status === VaultStatus.Paused && (
            <NoticeWarning
              description={
                'isPaused' in vault && vault.isPaused
                  ? t('vault.card.pausedWarning')
                  : t('vault.card.blockingPendingWithdrawalsWarning')
              }
            />
          )}
        </div>

        {/* Footer */}
        {readableUserStakedTokens && (
          <div className={cn('bg-cards px-4 sm:px-6 py-4 flex items-center justify-between')}>
            <span className="text-b1s">{footerLabel}</span>

            <div className={cn('flex items-center gap-x-3 text-b1s')}>
              <span>{readableUserStakedTokens}</span>
            </div>
          </div>
        )}
      </Card>

      {isPendleVault(vault) && (
        <PendleVaultModal
          vault={vault}
          isOpen={modalVisible}
          handleClose={() => setModalVisible(false)}
        />
      )}

      {isLegacyVenusVault(vault) && (
        <LegacyVaultModal
          vault={vault}
          isOpen={modalVisible}
          handleClose={() => setModalVisible(false)}
        />
      )}
    </>
  );
};
