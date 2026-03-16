import { cn } from '@venusprotocol/ui';
import BigNumber from 'bignumber.js';

import { useGetPrimeStatus } from 'clients/api';
import { Card, Icon, LabeledInlineContent, NoticeWarning, TokenIconWithSymbol } from 'components';
import { CopyAddressButton } from 'containers/CopyAddressButton';
import PrimeStatusBanner from 'containers/PrimeStatusBanner';
import useConvertMantissaToReadableTokenString from 'hooks/useConvertMantissaToReadableTokenString';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { type AnyVault, VaultManager, VaultStatus } from 'types';
import {
  convertMantissaToTokens,
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
} from 'utilities';

import { NULL_ADDRESS } from 'constants/address';
import { StatusLabel } from 'containers/Vault/VaultCard/StatusLabel';
import { useState } from 'react';
import PendleModal from '../VaultModals/PendleModal';
import { useVaultUsdValues } from '../hooks/useVaultUsdValues';
import TEST_IDS from '../testIds';
import { TokenIconWithPeriod } from './TokenIconWithPeriod';

export interface VaultProps {
  vault: AnyVault;
  className?: string;
}

export const VaultCard: React.FC<VaultProps> = ({ vault, className }) => {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  const { accountAddress } = useAccountAddress();
  const isPrimeEnabled = useIsFeatureEnabled({ name: 'prime' });
  const { data: getPrimeStatusData } = useGetPrimeStatus(
    {
      accountAddress: accountAddress || NULL_ADDRESS,
    },
    {
      enabled: !!accountAddress,
    },
  );
  const primePoolIndex = getPrimeStatusData?.xvsVaultPoolId;

  const readableUserStakedTokens = useConvertMantissaToReadableTokenString({
    token: vault.stakedToken,
    value: vault.userStakedMantissa || new BigNumber(0),
    addSymbol: false,
  });

  const dailyEmissionMantissa =
    'dailyEmissionMantissa' in vault ? vault.dailyEmissionMantissa : undefined;

  const {
    data: { dailyEmissionUsdCents, totalStakedUsdCents },
  } = useVaultUsdValues(vault);

  const openModal = () => {
    setModalVisible(true);
  };

  const clickAble = [VaultStatus.Active, VaultStatus.Deposit, VaultStatus.Claim].includes(
    vault.status,
  );

  return (
    <>
      <Card
        className={cn(
          'w-full flex flex-col p-0 overflow-hidden duration-250',
          !!openModal && 'cursor-pointer hover:border-blue',
          !clickAble && 'cursor-not-allowed',
          className,
        )}
        data-testid={TEST_IDS.userStakedTokens}
        onClick={openModal}
      >
        {/* Card body */}
        <div className={cn('bg-dark-blue p-3 sm:p-6 flex flex-col gap-4 sm:gap-6 flex-1')}>
          {/* Header */}
          <div className={cn('flex items-center justify-between')}>
            <div className={cn('flex items-center gap-x-3')}>
              {'maturityDate' in vault ? (
                <TokenIconWithPeriod
                  token={vault.stakedToken}
                  targetTime={vault.maturityDate}
                  size="md"
                  data-testid={TEST_IDS.symbol}
                />
              ) : (
                <TokenIconWithSymbol
                  token={vault.stakedToken}
                  displayChain
                  size="md"
                  data-testid={TEST_IDS.symbol}
                />
              )}

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
            <LabeledInlineContent label={t('vault.card.apr')}>
              <span className="text-b1s">
                {formatPercentageToReadableValue(vault.stakingAprPercentage)}
              </span>
            </LabeledInlineContent>

            {dailyEmissionMantissa && (
              <LabeledInlineContent label={t('vault.card.dailyEmission')}>
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
                      value: dailyEmissionUsdCents,
                    })}
                  </div>
                </div>
              </LabeledInlineContent>
            )}

            <LabeledInlineContent label={t('vault.card.totalDeposited')}>
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
                    value: totalStakedUsdCents,
                  })}
                </div>
              </div>
            </LabeledInlineContent>

            <LabeledInlineContent label={t('vault.card.manager')}>
              <Icon name={vault.managerIcon} />
              <span className="ms-2 text-b1r text-light-grey">{vault.manager?.toUpperCase()}</span>
            </LabeledInlineContent>
          </div>

          {/* Prime banner */}
          {isPrimeEnabled && primePoolIndex !== undefined && vault.poolIndex === primePoolIndex && (
            <PrimeStatusBanner
              className={cn('bg-background p-4 rounded-xl')}
              hidePromotionalTitle
            />
          )}

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
        <div className={cn('bg-cards px-4 sm:px-6 py-4 flex items-center justify-between')}>
          <span className="text-b1s">{t('vault.card.youStaked')}</span>

          <div className={cn('flex items-center gap-x-3 text-b1s')}>
            <span>
              {readableUserStakedTokens} {vault.stakedToken.symbol}
            </span>
          </div>
        </div>
      </Card>
      {modalVisible && vault.manager === VaultManager.Pendle && (
        <PendleModal
          vault={vault}
          isOpen={modalVisible}
          handleClose={() => setModalVisible(false)}
        />
      )}
    </>
  );
};
