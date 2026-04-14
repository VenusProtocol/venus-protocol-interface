import { cn } from '@venusprotocol/ui';

import { Card, Icon, LabeledInlineContent, NoticeInfo } from 'components';
import { CopyAddressButton } from 'containers/CopyAddressButton';
import useConvertMantissaToReadableTokenString from 'hooks/useConvertMantissaToReadableTokenString';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { useState } from 'react';
import type { InstitutionalVault } from 'types';
import { VaultStatus } from 'types';
import { convertMantissaToTokens, formatPercentageToReadableValue } from 'utilities';
import { Footer } from '../Footer';
import { StatusLabel } from '../StatusLabel';
import { TimelineTooltips } from '../TimelineTooltips';
import { TokenIconWithPeriod } from '../TokenIconWithPeriod';
import { VaultModal } from '../VaultModal';
import TEST_IDS from '../testIds';
import { isInstitutionalVault } from '../utils';

interface InstitutionalVaultCardProps {
  vault: InstitutionalVault;
  className?: string;
}

export const InstitutionalVaultCard: React.FC<InstitutionalVaultCardProps> = ({
  vault,
  className,
}) => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();

  const [modalVisible, setModalVisible] = useState(false);

  const convertedUserStakedTokens = useConvertMantissaToReadableTokenString({
    token: vault.rewardToken,
    value: vault.userStakedMantissa,
  });

  const readableUserStakedTokens = vault.userStakedMantissa?.gt(0)
    ? convertedUserStakedTokens
    : undefined;

  const totalDeposited = convertMantissaToTokens({
    value: vault.totalDepositedMantissa,
    token: vault.stakedToken,
    returnInReadableFormat: true,
    addSymbol: true,
  });

  const maxDeposit = convertMantissaToTokens({
    value: vault.maxDepositedMantissa,
    token: vault.stakedToken,
    returnInReadableFormat: true,
    addSymbol: true,
  });

  const minRequested = convertMantissaToTokens({
    value: vault.minRequestMantissa,
    token: vault.stakedToken,
    returnInReadableFormat: true,
    addSymbol: true,
  });

  const depositPercentage = vault.maxDepositedMantissa.gt(0)
    ? vault.totalDepositedMantissa.div(vault.maxDepositedMantissa).times(100).dp(0).toNumber()
    : 0;
  const readableDepositPercentage = formatPercentageToReadableValue(depositPercentage);

  const formattedOpenEndDate = vault.openEndDate
    ? t('vault.card.textualWithTime', {
        date: vault.openEndDate,
      })
    : undefined;

  const clickAble = ![VaultStatus.Inactive, VaultStatus.Paused].includes(vault.status);

  const openModal = () => {
    setModalVisible(true);
  };

  const DEPOSIT_LOW_THRESHOLD_PERCENTAGE = 20;
  const DEPOSIT_HIGH_THRESHOLD_PERCENTAGE = 80;

  let depositBarColorClassName = 'bg-blue';
  if (depositPercentage < DEPOSIT_LOW_THRESHOLD_PERCENTAGE) {
    depositBarColorClassName = 'bg-yellow';
  } else if (depositPercentage >= DEPOSIT_HIGH_THRESHOLD_PERCENTAGE) {
    depositBarColorClassName = 'bg-green';
  }

  const footerLabel =
    vault.status === VaultStatus.Claim ? t('vault.card.claimReward') : t('vault.card.youDeposited');

  const displayName = `${vault.stakedToken.symbol} - ${vault.manager?.toUpperCase()}`;
  const numOfDays =
    vault?.lockEndDate && vault?.openEndDate
      ? Math.ceil(
          (vault.lockEndDate.getTime() - vault.openEndDate.getTime()) / (1000 * 60 * 60 * 24),
        )
      : undefined;

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
        <div className="bg-dark-blue p-3 sm:p-6 flex flex-col gap-4 sm:gap-6 flex-1">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-3">
              <TokenIconWithPeriod
                token={{ ...vault.stakedToken, symbol: displayName }}
                targetDate={vault.lockEndDate}
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
          <div className="flex flex-col gap-y-4">
            <LabeledInlineContent
              label={t('vault.card.effectiveFixedApr')}
              tooltip={t('vault.card.effectiveFixedAprTooltip')}
              labelClassName="mb-auto"
            >
              <div className="flex items-center gap-x-1">
                <span className="text-b1s text-green">
                  {formatPercentageToReadableValue(vault.stakingAprPercentage)}
                </span>
              </div>
            </LabeledInlineContent>

            <LabeledInlineContent
              label={t('vault.card.totalDepositedMaxDeposit')}
              tooltip={
                numOfDays
                  ? t('vault.card.totalMaxDepositTooltipWithDays', { count: numOfDays })
                  : t('vault.card.totalMaxDepositTooltip')
              }
              labelClassName="mb-auto"
            >
              <div className="text-b1r text-end">
                <div className={cn('flex items-center justify-end gap-x-2')}>
                  {totalDeposited} / {maxDeposit}
                </div>
                <div className={cn('flex items-center justify-end gap-x-3 mt-2')}>
                  <div className={cn('w-25 h-2 rounded-full overflow-hidden bg-dark-grey')}>
                    <div
                      className={cn('h-full rounded-full', depositBarColorClassName)}
                      style={{ width: `${Math.min(depositPercentage, 100)}%` }}
                    />
                  </div>
                  <span>{readableDepositPercentage}</span>
                </div>
              </div>
            </LabeledInlineContent>

            <LabeledInlineContent label={t('vault.card.minRequested')} labelClassName="mb-auto">
              <span className="text-b1r">{minRequested}</span>
            </LabeledInlineContent>

            {formattedOpenEndDate && (
              <LabeledInlineContent
                label={t('vault.card.depositWindowEnds')}
                tooltip={<TimelineTooltips vault={vault} />}
                labelClassName="mb-auto"
              >
                <span className="text-b1r">{formattedOpenEndDate}</span>
              </LabeledInlineContent>
            )}

            <LabeledInlineContent label={t('vault.card.manager')} labelClassName="mb-auto">
              <Icon name={vault.managerIcon} />
              <span className={cn('ms-2 text-b1r text-light-grey')}>
                {vault.manager?.toUpperCase()}
              </span>
            </LabeledInlineContent>
          </div>

          {/* Notice */}
          {vault.status === VaultStatus.Deposit && formattedOpenEndDate && (
            <NoticeInfo
              description={t('vault.card.institutionalMinNotice', {
                date: formattedOpenEndDate,
              })}
            />
          )}
        </div>

        {/* Footer */}
        {readableUserStakedTokens && (
          <Footer label={footerLabel} content={readableUserStakedTokens} />
        )}
      </Card>
      {isInstitutionalVault(vault) && (
        <VaultModal
          vault={vault}
          isOpen={modalVisible}
          handleClose={() => setModalVisible(false)}
        />
      )}
    </>
  );
};
