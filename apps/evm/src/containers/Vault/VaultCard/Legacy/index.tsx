import { cn } from '@venusprotocol/ui';
import BigNumber from 'bignumber.js';

import { useGetPrimeStatus } from 'clients/api';
import { Card, CellGroup, LabeledInlineContent } from 'components';
import { Button, NoticeWarning, TokenIcon } from 'components';
import { AddTokenToWalletButton } from 'containers/AddTokenToWalletButton';
import PrimeStatusBanner from 'containers/PrimeStatusBanner';
import useConvertMantissaToReadableTokenString from 'hooks/useConvertMantissaToReadableTokenString';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { VenusVault as VaultType } from 'types';
import { convertMantissaToTokens, formatPercentageToReadableValue } from 'utilities';

import { NULL_ADDRESS } from 'constants/address';
import { useState } from 'react';
import TEST_IDS from '../../testIds';
import { type ActiveModal, VaultModals } from './VaultModals';

export interface VaultProps {
  vault: VaultType;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export const VaultCardLegacy: React.FC<VaultProps> = ({
  vault,
  variant = 'primary',
  className,
}) => {
  const [activeModal, setActiveModal] = useState<ActiveModal | undefined>();

  const onStake = () => setActiveModal('stake');
  const onWithdraw = () => setActiveModal('withdraw');

  const closeActiveModal = () => setActiveModal(undefined);

  const canWithdraw =
    typeof vault.poolIndex === 'number' ||
    !vault.userStakedMantissa ||
    vault.userStakedMantissa.isGreaterThan(0);

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

  const dataListItems = [
    {
      label: t('vault.card.stakingApr', { stakeTokenName: vault.stakedToken.symbol }),
      value: (
        <span className="font-semibold">
          {formatPercentageToReadableValue(vault.stakingAprPercentage)}
        </span>
      ),
    },
    {
      label: t('vault.card.dailyEmission'),
      value: (
        <div className="flex items-center gap-x-2">
          <TokenIcon className="w-4 h-4 sm:w-6 sm:h-6" token={vault.rewardToken} />

          <span className="font-semibold">
            {convertMantissaToTokens({
              value: vault.dailyEmissionMantissa,
              token: vault.rewardToken,
              returnInReadableFormat: true,

              addSymbol: false,
            })}
          </span>
        </div>
      ),
    },
  ];

  if (variant === 'primary') {
    dataListItems.push({
      label: t('vault.card.totalStaked'),
      value: (
        <div className="flex items-center gap-x-2">
          <TokenIcon className="w-4 h-4 sm:w-6 sm:h-6" token={vault.stakedToken} />

          <span className="font-semibold">
            {convertMantissaToTokens({
              value: vault.totalStakedMantissa,
              token: vault.stakedToken,
              returnInReadableFormat: true,

              addSymbol: false,
            })}
          </span>
        </div>
      ),
    });
  }

  return (
    <>
      <Card className={cn('w-full flex flex-col px-4 py-6', className)}>
        {variant === 'primary' && (
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-x-2">
              <TokenIcon className="w-6 h-6" token={vault.stakedToken} />

              <p className="text-lg" data-testid={TEST_IDS.symbol}>
                {vault.stakedToken.symbol}
              </p>

              <AddTokenToWalletButton
                className="shrink-0"
                isUserConnected={!!accountAddress}
                token={vault.stakedToken}
              />
            </div>
          </div>
        )}

        <p className="text-sm text-grey mb-1">{t('vault.card.youAreStake')}</p>

        <h2 className="inline-flex items-center gap-x-2" data-testid={TEST_IDS.userStakedTokens}>
          <TokenIcon
            className={cn(variant === 'primary' ? 'w-8 h-8' : 'w-6 h-6')}
            token={vault.stakedToken}
          />

          <span className={cn(variant === 'primary' ? 'text-3xl' : 'text-xl')}>
            {readableUserStakedTokens}
          </span>
        </h2>

        {variant === 'primary' &&
          isPrimeEnabled &&
          primePoolIndex !== undefined &&
          vault.poolIndex === primePoolIndex && (
            <PrimeStatusBanner className="bg-background p-4 sm:mt-2" hidePromotionalTitle />
          )}

        <div className="mt-4 sm:mt-6">
          {/* Mobile */}
          <div className="space-y-3 sm:hidden">
            {dataListItems.map(item => (
              <LabeledInlineContent label={item.label} key={item.label}>
                {item.value}
              </LabeledInlineContent>
            ))}
          </div>

          {/* SM and up */}
          <CellGroup className="hidden sm:flex" variant="secondary" cells={dataListItems} />
        </div>

        {(vault.isPaused || vault.userHasPendingWithdrawalsFromBeforeUpgrade) && (
          <NoticeWarning
            description={
              vault.isPaused
                ? t('vault.card.pausedWarning')
                : t('vault.card.blockingPendingWithdrawalsWarning')
            }
            className="mt-6"
          />
        )}

        {variant === 'primary' && (
          <div className="flex flex-col justify-between gap-y-3 pt-6 sm:flex-row sm:gap-x-4 sm:mt-auto sm:pt-8">
            <Button
              onClick={onStake}
              variant="primary"
              className="flex-1"
              disabled={vault.isPaused || vault.userHasPendingWithdrawalsFromBeforeUpgrade}
            >
              {t('vault.card.stake')}
            </Button>

            {canWithdraw && (
              <Button
                onClick={onWithdraw}
                variant="secondary"
                className="flex-1"
                disabled={vault.isPaused}
              >
                {t('vault.card.withdraw')}
              </Button>
            )}
          </div>
        )}
      </Card>

      {activeModal && (
        <VaultModals activeModal={activeModal} vault={vault} onClose={closeActiveModal} />
      )}
    </>
  );
};
