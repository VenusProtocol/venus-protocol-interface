import { cn } from '@venusprotocol/ui';
import { useState } from 'react';

import { Card, Icon, LabeledInlineContent, NoticeWarning } from 'components';
import { CopyAddressButton } from 'containers/CopyAddressButton';
import useConvertMantissaToReadableTokenString from 'hooks/useConvertMantissaToReadableTokenString';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { VaultStatus, type VenusVault } from 'types';
import {
  convertMantissaToTokens,
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
} from 'utilities';
import { Footer } from '../Footer';
import { StatusLabel } from '../StatusLabel';
import { TokenIconWithPeriod } from '../TokenIconWithPeriod';
import { VenusVaultModal } from '../VenusVaultModal';
import TEST_IDS from '../testIds';

interface VenusVaultProps {
  vault: VenusVault;
  className?: string;
}

export const VenusVaultCard: React.FC<VenusVaultProps> = ({ vault, className }) => {
  const { t } = useTranslation();

  const [modalVisible, setModalVisible] = useState(false);

  const { accountAddress } = useAccountAddress();

  const convertedUserStakedTokens = useConvertMantissaToReadableTokenString({
    token: vault.stakedToken,
    value: vault.userStakedMantissa,
  });

  const readableUserStakedTokens = vault?.userStakedMantissa?.gt(0)
    ? convertedUserStakedTokens
    : undefined;

  const dailyEmissionMantissa =
    'dailyEmissionMantissa' in vault ? vault.dailyEmissionMantissa : undefined;
  const dailyEmissionCents = 'dailyEmissionCents' in vault ? vault.dailyEmissionCents : undefined;

  const clickAble = ![VaultStatus.Paused].includes(vault.status);

  const openModal = () => {
    setModalVisible(true);
  };

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
                    token: vault.stakedToken,
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
          <Footer label={t('vault.card.youStaked')} content={readableUserStakedTokens} />
        )}
      </Card>

      <VenusVaultModal
        vault={vault}
        isOpen={modalVisible}
        handleClose={() => setModalVisible(false)}
      />
    </>
  );
};
