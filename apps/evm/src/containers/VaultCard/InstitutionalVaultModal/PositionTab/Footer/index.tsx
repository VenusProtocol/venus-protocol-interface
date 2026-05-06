import BigNumber from 'bignumber.js';
import type { ReactNode } from 'react';
import { Fragment } from 'react/jsx-runtime';

import { Delimiter, LabeledInlineContent, ValueUpdate } from 'components';
import { InstitutionalCheckpointInlineContent } from 'containers/VaultCard/InstitutionalCheckpointInlineContent';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { InstitutionalVault } from 'types';
import {
  convertMantissaToTokens,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
  formatWaitingPeriod,
} from 'utilities';
import { getTotalYieldTokens } from './getTotalYieldTokens';

export interface FooterProps {
  vault: InstitutionalVault;
  fromAmountTokens?: BigNumber;
}

export const Footer: React.FC<FooterProps> = ({ vault, fromAmountTokens }) => {
  const { t, language } = useTranslation();
  const { accountAddress } = useAccountAddress();

  const userStakedTokens = convertMantissaToTokens({
    value: vault.userStakeBalanceMantissa ?? new BigNumber(0),
    token: vault.stakedToken,
  });

  const hypotheticalUserStakedTokens = fromAmountTokens?.gt(0)
    ? userStakedTokens.plus(fromAmountTokens)
    : undefined;
  const readableLockingPeriod = formatWaitingPeriod({
    waitingPeriodSeconds: vault.lockingPeriodMs ? vault.lockingPeriodMs / 1000 : 0,
    locale: language.locale,
  });

  const items: Array<{ key: string; node: ReactNode }> = [];

  if (accountAddress) {
    items.push({
      key: 'currentDeposited',
      node: (
        <LabeledInlineContent
          label={t('vault.modals.currentDeposited')}
          tooltip={t('vault.modals.currentDepositedTooltip')}
        >
          <ValueUpdate
            original={formatTokensToReadableValue({
              value: userStakedTokens,
              token: vault.stakedToken,
            })}
            update={
              hypotheticalUserStakedTokens &&
              formatTokensToReadableValue({
                value: hypotheticalUserStakedTokens,
                token: vault.stakedToken,
              })
            }
          />
        </LabeledInlineContent>
      ),
    });
  }

  items.push({
    key: 'effectiveFixedApr',
    node: (
      <LabeledInlineContent
        label={t('vault.modals.effectiveFixedApr')}
        tooltip={t('vault.modals.effectiveFixedAprTooltip')}
      >
        {formatPercentageToReadableValue(vault.stakingAprPercentage)}
      </LabeledInlineContent>
    ),
  });

  if (accountAddress && vault.lockingPeriodMs !== undefined) {
    items.push({
      key: 'totalYields',
      node: (
        <LabeledInlineContent
          label={t('vault.modals.totalYields')}
          tooltip={t('vault.modals.institutionalDisclaimer', {
            lockingPeriod: readableLockingPeriod,
          })}
        >
          <ValueUpdate
            original={formatTokensToReadableValue({
              value: getTotalYieldTokens({
                depositTokens: userStakedTokens,
                fixedApyDecimal: vault.fixedApyDecimal,
                lockingPeriodMs: vault.lockingPeriodMs,
              }),
              token: vault.rewardToken,
            })}
            update={
              hypotheticalUserStakedTokens &&
              formatTokensToReadableValue({
                value: getTotalYieldTokens({
                  depositTokens: hypotheticalUserStakedTokens,
                  fixedApyDecimal: vault.fixedApyDecimal,
                  lockingPeriodMs: vault.lockingPeriodMs,
                }),
                token: vault.rewardToken,
              })
            }
          />
        </LabeledInlineContent>
      ),
    });
  }

  items.push({
    key: 'checkpoint',
    node: <InstitutionalCheckpointInlineContent vault={vault} />,
  });

  return (
    <div className="flex flex-col gap-y-4">
      {items.map(({ key, node }, index) => (
        <Fragment key={key}>
          {node}

          {index < items.length - 1 && <Delimiter />}
        </Fragment>
      ))}
    </div>
  );
};
