import { cn } from '@venusprotocol/ui';
import { useState } from 'react';

import { Card, Icon, LabeledInlineContent, LayeredValues, NoticeWarning } from 'components';
import { CopyAddressButton } from 'containers/CopyAddressButton';
import useConvertMantissaToReadableTokenString from 'hooks/useConvertMantissaToReadableTokenString';
import { useNow } from 'hooks/useNow';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { type Vault, VaultCategory, VaultManager, VaultStatus } from 'types';
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
import { PrimeEligibilityInlineContent } from './PrimeEligibilityInlineContent';
import { StatusLabel } from './StatusLabel';
import { VaultName } from './VaultName';
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

  const readableUserStakedTokens = useConvertMantissaToReadableTokenString({
    token: isPendleVault(vault) ? vault.rewardToken : vault.stakedToken,
    value: vault.userStakedMantissa,
  });

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

  const isInteractive =
    vault.status === VaultStatus.Active ||
    vault.status === VaultStatus.Earning ||
    vault.status === VaultStatus.Claim ||
    (vault.manager === VaultManager.Pendle && vault.status === VaultStatus.Deposit);

  const openModal = () => {
    setModalVisible(true);
  };

  let footerLabel: string | undefined = t('vault.card.youDeposited');
  if (hasMatured) {
    footerLabel = t('vault.card.claimReward');
  } else if (isLegacyVenusVault(vault)) {
    footerLabel = t('vault.card.youDeposited');
  }

  return (
    <>
      <Card
        className={cn(
          'w-full flex flex-col p-0 overflow-hidden duration-250',
          isInteractive ? 'cursor-pointer hover:border-blue' : 'cursor-not-allowed',
          className,
        )}
        data-testid={TEST_IDS.userStakedTokens}
        onClick={isInteractive ? openModal : undefined}
      >
        {/* Card body */}
        <div className={cn('bg-dark-blue p-3 sm:p-6 flex flex-col gap-4 sm:gap-6 flex-1')}>
          {/* Header */}
          <div className={cn('flex items-center justify-between')}>
            <div className={cn('flex items-center gap-x-3')}>
              <VaultName vault={vault} data-testid={TEST_IDS.symbol} className="min-h-10" />

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
            <LabeledInlineContent
              label={
                vault.manager === VaultManager.Pendle
                  ? t('vault.card.effectiveFixedApr')
                  : t('vault.card.apr')
              }
              labelClassName="mb-auto"
            >
              <LayeredValues
                className="text-end"
                topValue={formatPercentageToReadableValue(vault.stakingAprPercentage)}
                topValueClassName="text-b1s"
              />
            </LabeledInlineContent>

            {liquidityCents && (
              <LabeledInlineContent
                label={t('vault.card.liquidity')}
                labelClassName="mb-auto"
                tooltip={t('vault.card.liquidityTooltip')}
              >
                <LayeredValues
                  className="text-end"
                  topValue={formatTokensToReadableValue({
                    value: liquidityTokens,
                    token: isPendleVault(vault) ? vault.rewardToken : vault.stakedToken,
                  })}
                  bottomValue={formatCentsToReadableValue({
                    value: liquidityCents,
                  })}
                  topValueClassName="text-b1r"
                  bottomValueClassName="text-light-grey"
                />
              </LabeledInlineContent>
            )}

            {dailyEmissionMantissa && (
              <LabeledInlineContent label={t('vault.card.dailyEmission')} labelClassName="mb-auto">
                <LayeredValues
                  className="text-end"
                  topValue={convertMantissaToTokens({
                    value: dailyEmissionMantissa,
                    token: vault.rewardToken,
                    returnInReadableFormat: true,
                    addSymbol: true,
                  })}
                  bottomValue={formatCentsToReadableValue({
                    value: dailyEmissionCents,
                  })}
                  topValueClassName="text-b1r"
                  bottomValueClassName="text-light-grey"
                />
              </LabeledInlineContent>
            )}

            <LabeledInlineContent label={t('vault.card.totalDeposited')} labelClassName="mb-auto">
              <LayeredValues
                className="text-end"
                topValue={convertMantissaToTokens({
                  value: vault.totalStakedMantissa,
                  token: isPendleVault(vault) ? vault.rewardToken : vault.stakedToken,
                  returnInReadableFormat: true,
                  addSymbol: true,
                })}
                bottomValue={formatCentsToReadableValue({
                  value: vault.totalStakedCents,
                })}
                topValueClassName="text-b1r"
                bottomValueClassName="text-light-grey"
              />
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
                <LayeredValues
                  className="text-end"
                  topValue={formattedMaturityDate}
                  topValueClassName="text-b1r"
                />
              </LabeledInlineContent>
            )}

            {vault.category === VaultCategory.GOVERNANCE && <PrimeEligibilityInlineContent />}

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
        {!!accountAddress && readableUserStakedTokens && (
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
