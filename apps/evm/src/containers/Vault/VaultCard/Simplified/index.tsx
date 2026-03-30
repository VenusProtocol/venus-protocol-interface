import { cn } from '@venusprotocol/ui';
import BigNumber from 'bignumber.js';

import { Card, TokenIcon, TokenIconWithSymbol } from 'components';
import useConvertMantissaToReadableTokenString from 'hooks/useConvertMantissaToReadableTokenString';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { type AnyVault, VaultManager } from 'types';
import {
  convertMantissaToTokens,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';

import { PendleModal } from 'containers/Vault/VaultModals';
import { isPendleVault } from 'containers/Vault/VaultModals/utils';
import { useState } from 'react';
import TEST_IDS from '../../testIds';
import { Cell } from './Cell';

interface VaultCardSimplifiedProps {
  vault: AnyVault;
  className?: string;
}

// Vault Card in Dashboard
export const VaultCardSimplified: React.FC<VaultCardSimplifiedProps> = ({ vault, className }) => {
  const { t } = useTranslation();

  const [modalVisible, setModalVisible] = useState(false);
  const openModal = () => {
    setModalVisible(true);
  };

  const { accountAddress } = useAccountAddress();

  const readableUserStakedTokens = useConvertMantissaToReadableTokenString({
    token: vault.stakedToken,
    value: vault.userStakedMantissa || new BigNumber(0),
    addSymbol: false,
  });

  const isPaused =
    ('isPaused' in vault && vault.isPaused) ||
    ('userHasPendingWithdrawalsFromBeforeUpgrade' in vault &&
      vault.userHasPendingWithdrawalsFromBeforeUpgrade);

  const canWithdraw = vault.userStakedMantissa?.gt(0);
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

  const totalDepositedReadableValue = vault.totalStakedMantissa ? (
    <div className={cn('flex items-center gap-2 text-light-grey-active text-p2s')}>
      <TokenIcon token={vault.stakedToken} displayChain={false} size="md" />
      {formatTokensToReadableValue({
        value: convertMantissaToTokens({
          value: vault.totalStakedMantissa,
          token: vault.stakedToken,
        }),
        token: vault.stakedToken,
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
        onClick={isPaused || vault.manager === VaultManager.Venus ? undefined : openModal}
      >
        {showHoldingsCard ? (
          <div className="text-b1r text-light-grey">
            {t('vault.card.currentStaked')}
            <div className={cn('flex items-center text-p2s gap-2 text-light-grey-active')}>
              <TokenIcon token={vault.stakedToken} displayChain={false} size="lg" />
              {readableUserStakedTokens}
            </div>
          </div>
        ) : (
          <TokenIconWithSymbol
            token={vault.stakedToken}
            displayChain={false}
            size="lg"
            data-testid={TEST_IDS.symbol}
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

      {modalVisible && isPendleVault(vault) && (
        <PendleModal
          vault={vault}
          isOpen={modalVisible}
          handleClose={() => setModalVisible(false)}
        />
      )}
    </>
  );
};
