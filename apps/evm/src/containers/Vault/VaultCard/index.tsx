import { cn } from '@venusprotocol/ui';
import BigNumber from 'bignumber.js';

import { useGetPrimeStatus } from 'clients/api';
import { Card, LabeledInlineContent, NoticeWarning, TokenIconWithSymbol } from 'components';
import { CopyAddressButton } from 'containers/CopyAddressButton';
import PrimeStatusBanner from 'containers/PrimeStatusBanner';
import useConvertMantissaToReadableTokenString from 'hooks/useConvertMantissaToReadableTokenString';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { Vault } from 'types';
import {
  convertMantissaToTokens,
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
} from 'utilities';

import { StatusLabel } from 'components/StatusLabel';
import { NULL_ADDRESS } from 'constants/address';
import { getVaultMetadata } from 'pages/Staking/Vaults/utils';
import type { ActiveModal } from '../VaultModals';
import { useVaultUsdValues } from '../hooks/useVaultUsdValues';
import TEST_IDS from '../testIds';

export interface VaultProps {
  vault: Vault;
  onClick?: (vault: Vault, activeModal: ActiveModal) => void;
  className?: string;
}

export const VaultCard: React.FC<VaultProps> = ({ vault, className, onClick }) => {
  const { t } = useTranslation();

  const { curatorLogo } = getVaultMetadata(vault);

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

  const {
    data: { dailyEmissionUsdCents, totalStakedUsdCents },
  } = useVaultUsdValues(vault);

  const isPaused = vault.isPaused || vault.userHasPendingWithdrawalsFromBeforeUpgrade;

  const canWithdraw = vault.userStakedMantissa?.gt(0);
  const handleWithdraw = (e: React.MouseEvent<HTMLDivElement>) => {
    if (canWithdraw) {
      e.stopPropagation();
      onClick?.(vault, 'withdraw');
    }
  };

  return (
    <>
      <Card
        className={cn(
          'w-full flex flex-col p-0 overflow-hidden duration-250',
          !!onClick && 'cursor-pointer hover:border-blue',
          isPaused && !canWithdraw && 'cursor-not-allowed',
          className,
        )}
        data-testid={TEST_IDS.userStakedTokens}
        onClick={() => onClick?.(vault, 'stake')}
      >
        {/* Card body */}
        <div className={cn('bg-dark-blue p-3 sm:p-6 flex flex-col gap-4 sm:gap-6 flex-1')}>
          {/* Header */}
          <div className={cn('flex items-center justify-between')}>
            <div className={cn('flex items-center gap-x-3')}>
              <TokenIconWithSymbol
                token={vault.stakedToken}
                displayChain
                size="md"
                data-testid={TEST_IDS.symbol}
              />

              {accountAddress && (
                <CopyAddressButton
                  className="shrink-0 text-light-grey"
                  address={vault.stakedToken?.address}
                />
              )}
            </div>

            <StatusLabel variant="primary">{t('vault.filter.active')}</StatusLabel>
          </div>

          {/* Stats */}
          <div className={cn('flex flex-col gap-y-4')}>
            <LabeledInlineContent label={t('vault.card.apr')}>
              <span className="text-b1s">
                {formatPercentageToReadableValue(vault.stakingAprPercentage)}
              </span>
            </LabeledInlineContent>

            <LabeledInlineContent label={t('vault.card.dailyEmission')}>
              <div className="text-b1r text-end">
                <div className={cn('flex items-center gap-x-2')}>
                  {convertMantissaToTokens({
                    value: vault.dailyEmissionMantissa,
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

            <LabeledInlineContent label={t('vault.card.totalStaked')}>
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
              {curatorLogo}
              <span className="ms-2">{t('vault.card.venusManager')}</span>
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
          {(vault.isPaused || vault.userHasPendingWithdrawalsFromBeforeUpgrade) && (
            <NoticeWarning
              description={
                vault.isPaused
                  ? t('vault.card.pausedWarning')
                  : t('vault.card.blockingPendingWithdrawalsWarning')
              }
            />
          )}
        </div>

        {/* Footer */}
        <div
          className={cn('bg-cards px-4 sm:px-6 py-4 flex items-center justify-between')}
          onClick={handleWithdraw}
        >
          <span className="text-b1s">{t('vault.card.youStaked')}</span>

          <div className={cn('flex items-center gap-x-3 text-b1s')}>
            <span>
              {readableUserStakedTokens} {vault.stakedToken.symbol}
            </span>
          </div>
        </div>
      </Card>
    </>
  );
};
