import BigNumber from 'bignumber.js';

import { useGetPrimeStatus } from 'clients/api';
import {
  Delimiter,
  LabeledInlineContent,
  type LabeledInlineContentProps,
  ValueUpdate,
} from 'components';
import { NULL_ADDRESS } from 'constants/address';
import PrimeStatusBanner from 'containers/PrimeStatusBanner';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useNow } from 'hooks/useNow';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { Fragment } from 'react/jsx-runtime';
import { type Vault, VaultManager } from 'types';
import {
  clampToZero,
  convertMantissaToTokens,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';
import { calculateDailyVaultEarnings } from './calculateDailyVaultEarnings';

export interface FooterProps {
  action: 'stake' | 'withdraw';
  vault: Vault;
  fromAmountTokens: BigNumber;
}

export const Footer: React.FC<FooterProps> = ({ action, vault, fromAmountTokens }) => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();

  const now = useNow();

  const isPrimeEnabled = useIsFeatureEnabled({
    name: 'prime',
  });

  const { data: getPrimeStatusData } = useGetPrimeStatus(
    {
      accountAddress: accountAddress || NULL_ADDRESS,
    },
    {
      enabled: !!accountAddress,
    },
  );
  const primePoolIndex = getPrimeStatusData?.xvsVaultPoolId;

  const items: LabeledInlineContentProps[] = [];

  if (accountAddress && vault.manager === VaultManager.Venus) {
    const userStakedTokens = convertMantissaToTokens({
      value: vault.userStakedMantissa || new BigNumber(0),
      token: vault.stakedToken,
    });

    const hypotheticalUserStakedTokens = clampToZero({
      value:
        action === 'stake'
          ? userStakedTokens.plus(fromAmountTokens)
          : userStakedTokens.minus(fromAmountTokens),
    });

    const userEstimateDailyEarningsTokens = calculateDailyVaultEarnings({
      balance: userStakedTokens,
      vault,
    });

    const hypotheticalUserEstimateDailyEarningsTokens = fromAmountTokens.isGreaterThan(0)
      ? calculateDailyVaultEarnings({
          balance: hypotheticalUserStakedTokens,
          vault,
        })
      : undefined;

    items.push(
      {
        label: t('vaultCard.vaultModal.footer.currentlyStaked'),
        children: (
          <ValueUpdate
            original={formatTokensToReadableValue({
              value: userStakedTokens,
              token: vault.stakedToken,
            })}
            update={
              hypotheticalUserEstimateDailyEarningsTokens &&
              formatTokensToReadableValue({
                value: hypotheticalUserStakedTokens,
                token: vault.stakedToken,
              })
            }
          />
        ),
      },
      {
        label: t('vaultCard.vaultModal.footer.estimatedDailyEarnings'),
        children: (
          <ValueUpdate
            original={formatTokensToReadableValue({
              value: userEstimateDailyEarningsTokens,
              token: vault.rewardToken,
            })}
            update={
              hypotheticalUserEstimateDailyEarningsTokens &&
              formatTokensToReadableValue({
                value: hypotheticalUserEstimateDailyEarningsTokens,
                token: vault.rewardToken,
              })
            }
          />
        ),
      },
    );
  }

  if (accountAddress && vault.lockingPeriodMs) {
    const unlockingDate = new Date(now.getTime() + vault.lockingPeriodMs);

    items.push({
      label: t('vaultCard.vaultModal.footer.lockingPeriod.label'),
      tooltip: t('vaultCard.vaultModal.footer.lockingPeriod.tooltip'),
      children: t('vaultCard.vaultModal.footer.lockingPeriod.duration', { date: unlockingDate }),
    });
  }

  items.push({
    label: t('vaultCard.vaultModal.stakeForm.footer.apr'),
    children: formatPercentageToReadableValue(vault.stakingAprPercentage),
  });

  return (
    <div className="flex flex-col gap-y-4">
      {items.map((item, index) => (
        <Fragment key={String(item.label)}>
          <LabeledInlineContent {...item} />

          {index < items.length - 1 && <Delimiter />}
        </Fragment>
      ))}

      {isPrimeEnabled && primePoolIndex !== undefined && vault.poolIndex === primePoolIndex && (
        <PrimeStatusBanner hidePromotionalTitle />
      )}
    </div>
  );
};
