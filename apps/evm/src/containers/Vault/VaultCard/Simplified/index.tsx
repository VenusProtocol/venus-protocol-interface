import { cn } from '@venusprotocol/ui';
import BigNumber from 'bignumber.js';

import { Card, TokenIcon, TokenIconWithSymbol } from 'components';
import useConvertMantissaToReadableTokenString from 'hooks/useConvertMantissaToReadableTokenString';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { Vault } from 'types';
import {
  convertMantissaToTokens,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';

import { PLACEHOLDER_KEY } from 'constants/placeholders';
import TEST_IDS from '../../testIds';
import { Cell } from './Cell';

interface VaultCardSimplifiedProps {
  vault: Vault;
  className?: string;
}

// Vault Card in Dashboard
export const VaultCardSimplified: React.FC<VaultCardSimplifiedProps> = ({ vault, className }) => {
  const { t } = useTranslation();

  const { accountAddress } = useAccountAddress();

  const readableUserStakedTokens = useConvertMantissaToReadableTokenString({
    token: vault.stakedToken,
    value: vault.userStakedMantissa || new BigNumber(0),
    addSymbol: false,
  });

  const isPaused = vault.isPaused || vault.userHasPendingWithdrawalsFromBeforeUpgrade;

  const canWithdraw = vault.userStakedMantissa?.gt(0);
  const showHoldingsCard = accountAddress && canWithdraw;

  return (
    <Card
      className={cn(
        'w-full flex flex-col p-3 gap-3 duration-200',
        !isPaused && 'cursor-pointer hover:border-blue',
        className,
      )}
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

        {showHoldingsCard ? (
          <Cell
            title={t('vault.card.dailyEmission')}
            content={
              vault.dailyEmissionMantissa
                ? formatTokensToReadableValue({
                    value: convertMantissaToTokens({
                      value: vault.dailyEmissionMantissa,
                      token: vault.rewardToken,
                    }),
                    token: vault.rewardToken,
                  })
                : PLACEHOLDER_KEY
            }
          />
        ) : (
          <Cell
            title={t('vault.card.totalDeposited')}
            content={
              vault.totalStakedMantissa ? (
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
              ) : (
                PLACEHOLDER_KEY
              )
            }
          />
        )}
      </div>
    </Card>
  );
};
