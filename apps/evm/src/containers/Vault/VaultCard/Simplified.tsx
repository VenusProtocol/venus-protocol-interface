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

import type { ActiveModal } from '../VaultModals';
import TEST_IDS from '../testIds';

interface VaultCardSimplifiedProps {
  vault: Vault;
  onClick?: (vault: Vault, activeModal?: ActiveModal) => void;
  className?: string;
}

// Vault Card in Dashboard
export const VaultCardSimplified: React.FC<VaultCardSimplifiedProps> = ({
  vault,
  className,
  onClick,
}) => {
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
        !!onClick && !isPaused && 'cursor-pointer hover:border-blue',
        className,
      )}
      onClick={() => onClick?.(vault, 'stake')}
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
        <div className="flex flex-col w-full flex-1">
          <div className={cn('text-b1r text-light-grey mb-1')}>{t('vault.card.apr')}</div>
          <div className={cn('text-light-grey-active text-p2s')}>
            {formatPercentageToReadableValue(vault.stakingAprPercentage)}
          </div>
        </div>

        <div className="flex flex-col w-full flex-1">
          {showHoldingsCard ? (
            <>
              <div className={cn('text-b1r text-light-grey mb-1')}>
                {t('vault.card.dailyEmission')}
              </div>
              {vault.dailyEmissionMantissa && (
                <div className={cn('flex items-center gap-2 text-light-grey-active text-p2s')}>
                  {formatTokensToReadableValue({
                    value: convertMantissaToTokens({
                      value: vault.dailyEmissionMantissa,
                      token: vault.rewardToken,
                    }),
                    token: vault.rewardToken,
                  })}
                </div>
              )}
            </>
          ) : (
            <>
              <div className={cn('text-b1r text-light-grey mb-1')}>
                {t('vault.card.totalDeposited')}
              </div>
              {vault.totalStakedMantissa && (
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
              )}
            </>
          )}
        </div>
      </div>
    </Card>
  );
};
