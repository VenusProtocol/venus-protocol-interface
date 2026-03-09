import { cn } from '@venusprotocol/ui';
import BigNumber from 'bignumber.js';

import { useGetPrimeStatus } from 'clients/api';
import {
  Card,
  LabeledInlineContent,
  NoticeWarning,
  TokenIcon,
  TokenIconWithSymbol,
} from 'components';
import { CopyAddressButton } from 'containers/CopyAddressButton';
import PrimeStatusBanner from 'containers/PrimeStatusBanner';
import useConvertMantissaToReadableTokenString from 'hooks/useConvertMantissaToReadableTokenString';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { Vault } from 'types';
import {
  convertMantissaToTokens,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';

import { StatusLabel } from 'components/StatusLabel';
import { NULL_ADDRESS } from 'constants/address';
import TEST_IDS from '../testIds';

export interface VaultProps {
  vault: Vault;
  onStake?: () => void;
  onWithdraw?: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export const VaultCard: React.FC<VaultProps> = ({
  vault,
  className,
  onStake,
  onWithdraw,
  variant = 'primary',
}) => {
  const { t } = useTranslation();

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

  const isPaused = vault.isPaused || vault.userHasPendingWithdrawalsFromBeforeUpgrade;

  const canWithdraw = vault.userStakedMantissa?.gt(0);

  const handleWithdraw = (e: React.MouseEvent<HTMLDivElement>) => {
    if (canWithdraw) {
      e.stopPropagation();
      onWithdraw?.();
    }
  };

  // Vault Card in Dashboard
  if (variant === 'secondary') {
    return (
      <Card className={cn('w-full flex flex-col p-3 gap-3', className)}>
        <TokenIconWithSymbol
          token={vault.stakedToken}
          displayChain={false}
          size="md"
          data-testid={TEST_IDS.symbol}
        />
        <div className="flex">
          <div className="flex flex-col w-full flex-1 pr-6">
            <div className={cn('text-b1r text-light-grey mb-1')}>
              {t('vault.card.stakingApr', { tokenSymbol: vault.stakedToken.symbol })}
            </div>
            <div className={cn('text-light-grey-active text-p2s')}>
              {formatPercentageToReadableValue(vault.stakingAprPercentage)}
            </div>
          </div>

          <div className="flex flex-col w-full flex-1 border-l border-dark-grey px-6">
            <div className={cn('text-b1r text-light-grey mb-1')}>{t('vault.card.totalStaked')}</div>
            {vault.userStakedMantissa && (
              <div className={cn('flex items-center gap-2 text-light-grey-active text-p2s')}>
                <TokenIcon token={vault.stakedToken} displayChain={false} size="md" />
                {formatTokensToReadableValue({
                  value: convertMantissaToTokens({
                    value: vault.userStakedMantissa,
                    token: vault.stakedToken,
                  }),
                  token: vault.stakedToken,
                })}
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card
        className={cn(
          'w-full flex flex-col p-0 overflow-hidden duration-250',
          !!onStake && 'cursor-pointer hover:border-blue',
          isPaused && !canWithdraw && 'cursor-not-allowed',
          className,
        )}
        data-testid={TEST_IDS.userStakedTokens}
        onClick={onStake}
      >
        {/* Card body */}
        <div className={cn('bg-dark-blue p-4 sm:p-6 flex flex-col gap-4 sm:gap-6 flex-1')}>
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

            <StatusLabel variant="primary">{t('vault.card.status.active')}</StatusLabel>
          </div>

          {/* Stats */}
          <div className={cn('flex flex-col gap-y-4')}>
            <LabeledInlineContent label={t('vault.card.apr')}>
              <span className="text-b1s text-green">
                {formatPercentageToReadableValue(vault.stakingAprPercentage)}
              </span>
            </LabeledInlineContent>

            <LabeledInlineContent label={t('vault.card.dailyEmission')}>
              <div className={cn('flex items-center gap-x-2')}>
                <TokenIcon className="w-4 h-4" token={vault.rewardToken} />
                <span>
                  {convertMantissaToTokens({
                    value: vault.dailyEmissionMantissa,
                    token: vault.rewardToken,
                    returnInReadableFormat: true,
                    addSymbol: true,
                  })}
                </span>
              </div>
            </LabeledInlineContent>

            <LabeledInlineContent label={t('vault.card.totalStaked')}>
              <div className={cn('flex items-center gap-x-2')}>
                <TokenIcon className="w-4 h-4" token={vault.stakedToken} />
                <span>
                  {convertMantissaToTokens({
                    value: vault.totalStakedMantissa,
                    token: vault.stakedToken,
                    returnInReadableFormat: true,
                    addSymbol: true,
                  })}
                </span>
              </div>
            </LabeledInlineContent>

            <LabeledInlineContent label={t('vault.card.manager')}>
              <span>{t('vault.card.venusManager')}</span>
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
