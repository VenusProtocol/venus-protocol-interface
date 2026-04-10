import { cn } from '@venusprotocol/ui';
import BigNumber from 'bignumber.js';

import { Card, Icon, LabeledInlineContent, NoticeInfo } from 'components';
import { CopyAddressButton } from 'containers/CopyAddressButton';
import { StatusLabel } from 'containers/Vault/VaultCard/StatusLabel';
import { VaultModal } from 'containers/Vault/VaultModals';
import useConvertMantissaToReadableTokenString from 'hooks/useConvertMantissaToReadableTokenString';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { useState } from 'react';
import type { InstitutionalVault } from 'types';
import { VaultStatus } from 'types';
import {
  convertMantissaToTokens,
  formatPercentageToReadableValue,
  isInstitutionalVault,
} from 'utilities';
import TEST_IDS from '../../testIds';
import { Footer } from '../Footer';
import { TokenIconWithPeriod } from '../TokenIconWithPeriod';

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

  const readableUserStakedTokens = useConvertMantissaToReadableTokenString({
    token: vault.stakedToken,
    value: vault.userStakedMantissa || new BigNumber(0),
  });

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

  const formattedOpenEndDate = vault.openEndDate
    ? t('vault.card.textualWithTime', {
        date: vault.openEndDate,
      })
    : undefined;

  const clickAble = ![VaultStatus.Inactive, VaultStatus.Paused].includes(vault.status);

  const openModal = () => {
    setModalVisible(true);
  };

  const footerLabel =
    vault.status === VaultStatus.Claim ? t('vault.card.claimReward') : t('vault.card.youDeposited');

  const displayName = `${vault.stakedToken.symbol} - ${vault.manager?.toUpperCase()}`;

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
                token={{ ...vault.stakedToken, symbol: displayName }}
                targetDate={vault.openEndDate}
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
            <LabeledInlineContent
              label={t('vault.card.effectiveFixedApr')}
              tooltip={t('vault.card.effectiveFixedAprTooltip')}
            >
              <div className="flex items-center gap-x-1">
                <span className="text-b1s text-green">
                  {formatPercentageToReadableValue(vault.stakingAprPercentage)}
                </span>
              </div>
            </LabeledInlineContent>

            <LabeledInlineContent
              label={t('vault.card.totalDepositedMaxDeposit')}
              tooltip={t('vault.card.totalDepositedMaxDepositTooltip')}
            >
              <div className="text-b1r text-end">
                <div className="flex items-center justify-end gap-x-2">
                  {totalDeposited} / {maxDeposit}
                </div>
                <div className="flex items-center justify-end gap-x-3 mt-2">
                  <div className="w-25 h-2 rounded-full bg-[rgb(45,53,73)] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-yellow"
                      style={{ width: `${Math.min(depositPercentage, 100)}%` }}
                    />
                  </div>
                  <span>{depositPercentage}%</span>
                </div>
              </div>
            </LabeledInlineContent>

            <LabeledInlineContent label={t('vault.card.minRequested')}>
              <span className="text-b1r">{minRequested}</span>
            </LabeledInlineContent>

            {formattedOpenEndDate && (
              <LabeledInlineContent
                label={t('vault.card.depositWindowEnds')}
                tooltip={t('vault.card.depositWindowEndsTooltip')}
              >
                <span className="text-b1r">{formattedOpenEndDate}</span>
              </LabeledInlineContent>
            )}

            <LabeledInlineContent label={t('vault.card.manager')}>
              <Icon name={vault.managerIcon} />
              <span className="ms-2 text-b1r text-light-grey">{vault.manager?.toUpperCase()}</span>
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
        <Footer label={footerLabel} content={readableUserStakedTokens} />
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
