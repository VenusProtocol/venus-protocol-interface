import { cn } from '@venusprotocol/ui';
import BigNumber from 'bignumber.js';

import { Card, TokenIcon, TokenIconWithSymbol } from 'components';
import { HidableUserBalance } from 'containers/HidableUserBalance';
import useConvertMantissaToReadableTokenString from 'hooks/useConvertMantissaToReadableTokenString';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { Vault } from 'types';
import { VaultStatus } from 'types';
import {
  convertMantissaToTokens,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
  isInstitutionalVault,
  isLegacyVenusVault,
  isPendleVault,
} from 'utilities';

import { InstitutionalVaultModal } from 'containers/VaultCard/InstitutionalVaultModal';
import { PendleVaultModal } from 'containers/VaultCard/PendleVaultModal';
import { useState } from 'react';
import { VenusVaultModal } from '../VenusVaultModal';
import { Cell } from './Cell';

interface VaultCardSimplifiedProps {
  vault: Vault;
  className?: string;
}

// Vault Card in Dashboard
export const VaultCardSimplified: React.FC<VaultCardSimplifiedProps> = ({ vault, className }) => {
  const { t } = useTranslation();

  const [shouldShowModal, setShouldShowModal] = useState(false);

  const showModal = () => setShouldShowModal(true);
  const hideModal = () => setShouldShowModal(false);

  const { accountAddress } = useAccountAddress();
  const displayToken = isPendleVault(vault) ? vault.rewardToken : vault.stakedToken;

  const readableUserStakedTokens = useConvertMantissaToReadableTokenString({
    token: displayToken,
    value: vault.userStakeBalanceMantissa || new BigNumber(0),
    addSymbol: false,
  });

  const isPaused = ('isPaused' in vault && vault.isPaused) || vault.status === VaultStatus.Inactive;

  const canWithdraw = vault.userStakeBalanceMantissa?.gt(0);
  const showHoldingsCard = accountAddress && canWithdraw;

  const dailyEmissionReadableValue =
    'dailyEmissionMantissa' in vault && vault.dailyEmissionMantissa
      ? formatTokensToReadableValue({
          value: convertMantissaToTokens({
            value: vault.dailyEmissionMantissa,
            token: vault.rewardToken,
          }),
          token: vault.rewardToken,
        })
      : undefined;

  const totalDepositedReadableValue = vault.stakeBalanceMantissa ? (
    <div className={cn('flex items-center gap-2 text-light-grey-active text-p2s')}>
      <TokenIcon token={displayToken} displayChain={false} size="md" />
      {formatTokensToReadableValue({
        value: convertMantissaToTokens({
          value: vault.stakeBalanceMantissa,
          token: displayToken,
        }),
        token: displayToken,
      })}
    </div>
  ) : undefined;

  return (
    <>
      <Card
        className={cn(
          'w-full h-full flex flex-col p-3 gap-3 duration-200',
          !isPaused && 'cursor-pointer hover:border-blue',
          className,
        )}
        onClick={isPaused ? undefined : showModal}
      >
        {showHoldingsCard ? (
          <div className="text-b1r text-light-grey">
            {t('vault.card.currentDeposited')}
            <div className={cn('flex items-center text-p2s gap-2 text-light-grey-active')}>
              <TokenIcon token={displayToken} displayChain={false} size="lg" />
              <HidableUserBalance>{readableUserStakedTokens}</HidableUserBalance>
            </div>
          </div>
        ) : (
          <TokenIconWithSymbol
            token={vault.stakedToken}
            displayChain={false}
            size="lg"
            className="text-p2s"
          />
        )}
        <div className="flex">
          <Cell
            title={t('vault.card.apr')}
            content={formatPercentageToReadableValue(vault.stakingAprPercentage)}
          />
          {showHoldingsCard && dailyEmissionReadableValue && (
            <Cell title={t('vault.card.dailyEmission')} content={dailyEmissionReadableValue} />
          )}
          {!showHoldingsCard && totalDepositedReadableValue && (
            <Cell title={t('vault.card.totalDeposited')} content={totalDepositedReadableValue} />
          )}
        </div>
      </Card>

      {isPendleVault(vault) && (
        <PendleVaultModal vault={vault} isOpen={shouldShowModal} handleClose={hideModal} />
      )}

      {isLegacyVenusVault(vault) && (
        <VenusVaultModal vault={vault} isOpen={shouldShowModal} handleClose={hideModal} />
      )}

      {isInstitutionalVault(vault) && (
        <InstitutionalVaultModal vault={vault} isOpen={shouldShowModal} handleClose={hideModal} />
      )}
    </>
  );
};
