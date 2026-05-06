import { cn } from '@venusprotocol/ui';
import { useState } from 'react';

import { Card, LabeledInlineContent, LayeredValues, NoticeWarning } from 'components';
import { CopyAddressButton } from 'containers/CopyAddressButton';
import useConvertMantissaToReadableTokenString from 'hooks/useConvertMantissaToReadableTokenString';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { type Vault, VaultCategory, VaultStatus, VaultVenue } from 'types';
import {
  convertMantissaToTokens,
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
  isInstitutionalVault,
  isLegacyVenusVault,
  isPendleVault,
} from 'utilities';
import { InstitutionalCheckpointInlineContent } from './InstitutionalCheckpointInlineContent';
import { InstitutionalVaultModal } from './InstitutionalVaultModal';
import { PendleVaultModal } from './PendleVaultModal';
import { PrimeEligibilityInlineContent } from './PrimeEligibilityInlineContent';
import { Progress } from './Progress';
import { StatusLabel } from './StatusLabel';
import { VaultName } from './VaultName';
import { VenusVaultModal } from './VenusVaultModal';

export interface VaultProps {
  vault: Vault;
  className?: string;
}

export const VaultCard: React.FC<VaultProps> = ({ vault, className }) => {
  const { t } = useTranslation();

  const [modalVisible, setModalVisible] = useState(false);

  const { accountAddress } = useAccountAddress();

  const readableUserStakedTokens = useConvertMantissaToReadableTokenString({
    token: isPendleVault(vault) ? vault.rewardToken : vault.stakedToken,
    value: vault.userStakeBalanceMantissa,
  });

  const dailyEmissionMantissa =
    'dailyEmissionMantissa' in vault ? vault.dailyEmissionMantissa : undefined;
  const dailyEmissionCents = 'dailyEmissionCents' in vault ? vault.dailyEmissionCents : undefined;

  const liquidityCents = 'liquidityCents' in vault ? vault.liquidityCents : undefined;
  const liquidityTokens = liquidityCents
    ? liquidityCents?.div(
        isPendleVault(vault) ? vault.rewardTokenPriceCents : vault.stakedTokenPriceCents,
      )
    : undefined;

  const formattedMaturityDate =
    'maturityDate' in vault && isPendleVault(vault) && vault.maturityDate
      ? t('vault.card.textualWithTime', {
          date: vault.maturityDate,
        })
      : undefined;

  const openModal = () => setModalVisible(true);

  const shouldDisplayInstitutionalMinRequested =
    isInstitutionalVault(vault) && vault.stakeBalanceMantissa.lt(vault.stakeMinMantissa);

  const readableInstitutionalMinRequested = shouldDisplayInstitutionalMinRequested
    ? formatTokensToReadableValue({
        value: convertMantissaToTokens({
          value: vault.stakeMinMantissa,
          token: vault.stakedToken,
        }),
        token: vault.stakedToken,
      })
    : undefined;

  return (
    <>
      <Card
        className={cn(
          'w-full flex flex-col p-0 overflow-hidden duration-250 cursor-pointer hover:border-blue',
          className,
        )}
        onClick={openModal}
      >
        <div className={cn('bg-dark-blue p-3 sm:p-6 flex flex-col gap-4 sm:gap-6 flex-1')}>
          <div className={cn('flex items-center justify-between')}>
            <div className={cn('flex items-center gap-x-3')}>
              <VaultName vault={vault} className="min-h-10" />

              {accountAddress && (
                <CopyAddressButton
                  className="shrink-0 text-light-grey"
                  address={vault.stakedToken?.address}
                />
              )}
            </div>

            <StatusLabel status={vault.status} />
          </div>

          <div className={cn('flex flex-col gap-y-4')}>
            <LabeledInlineContent
              tooltip={vault.venue !== VaultVenue.Venus && t('vault.card.targetAprTooltip')}
              label={
                vault.venue !== VaultVenue.Venus ? t('vault.card.targetApr') : t('vault.card.apr')
              }
              labelClassName="mb-auto"
            >
              <LayeredValues
                className="text-end"
                topValue={formatPercentageToReadableValue(vault.stakeAprPercentage)}
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

            <LabeledInlineContent
              label={t('vault.card.totalDeposited')}
              tooltip={
                isInstitutionalVault(vault) ? t('vault.modals.institutionalDisclaimer') : undefined
              }
              labelClassName="mb-auto"
            >
              {isInstitutionalVault(vault) ? (
                <Progress
                  amountTokens={convertMantissaToTokens({
                    value: vault.stakeBalanceMantissa,
                    token: vault.stakedToken,
                  })}
                  maxTokens={convertMantissaToTokens({
                    value: vault.stakeLimitMantissa,
                    token: vault.stakedToken,
                  })}
                  token={vault.stakedToken}
                  progressBarClassName={
                    vault.status === VaultStatus.Refund ? 'bg-yellow' : undefined
                  }
                />
              ) : (
                <LayeredValues
                  className="text-end"
                  topValue={convertMantissaToTokens({
                    value: vault.stakeBalanceMantissa,
                    token: isPendleVault(vault) ? vault.rewardToken : vault.stakedToken,
                    returnInReadableFormat: true,
                    addSymbol: true,
                  })}
                  bottomValue={formatCentsToReadableValue({
                    value: vault.stakeBalanceCents,
                  })}
                  topValueClassName="text-b1r"
                  bottomValueClassName="text-light-grey"
                />
              )}
            </LabeledInlineContent>

            {shouldDisplayInstitutionalMinRequested && readableInstitutionalMinRequested && (
              <LabeledInlineContent label={t('vault.card.minRequested')} labelClassName="mb-auto">
                <LayeredValues
                  className="text-end"
                  topValue={readableInstitutionalMinRequested}
                  topValueClassName="text-b1r"
                />
              </LabeledInlineContent>
            )}

            {formattedMaturityDate && (
              <LabeledInlineContent
                label={t('vault.card.maturityDate')}
                labelClassName="mb-auto"
                tooltip={
                  vault.venue === VaultVenue.Pendle
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

            {isInstitutionalVault(vault) && (
              <InstitutionalCheckpointInlineContent vault={vault} labelClassName="mb-auto" />
            )}

            {vault.category === VaultCategory.GOVERNANCE && <PrimeEligibilityInlineContent />}

            <LabeledInlineContent label={t('vault.card.venue')} labelClassName="mb-auto">
              <img src={vault.venueIconSrc} className="h-4" alt={t('vault.card.vaultVenueIcon')} />
            </LabeledInlineContent>
          </div>

          {vault.status === VaultStatus.Paused && (
            <NoticeWarning
              description={
                !isInstitutionalVault(vault) && 'isPaused' in vault && vault.isPaused
                  ? t('vault.card.pausedWarning')
                  : isInstitutionalVault(vault)
                    ? t('vault.card.pausedWarning')
                    : t('vault.card.blockingPendingWithdrawalsWarning')
              }
            />
          )}
        </div>

        {!!accountAddress && readableUserStakedTokens && (
          <div className={cn('bg-cards px-4 sm:px-6 py-4 flex items-center justify-between')}>
            <span className="text-b1s">{t('vault.card.youDeposited')}</span>

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
        <VenusVaultModal
          vault={vault}
          isOpen={modalVisible}
          handleClose={() => setModalVisible(false)}
        />
      )}

      {isInstitutionalVault(vault) && (
        <InstitutionalVaultModal
          vault={vault}
          isOpen={modalVisible}
          handleClose={() => setModalVisible(false)}
        />
      )}
    </>
  );
};
