import BigNumber from 'bignumber.js';
import type { ReactNode } from 'react';
import { Fragment } from 'react/jsx-runtime';

import { Delimiter, LabeledInlineContent, ValueUpdate } from 'components';
import { InstitutionalCheckpointInlineContent } from 'containers/VaultCard/InstitutionalCheckpointInlineContent';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { type InstitutionalVault, VaultStatus } from 'types';
import {
  convertMantissaToTokens,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';
import { getProjectedYieldTokens } from './getProjectedYieldTokens';

export interface FooterProps {
  vault: InstitutionalVault;
  fromAmountTokens?: BigNumber;
}

export const Footer: React.FC<FooterProps> = ({ vault, fromAmountTokens }) => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();

  const userStakedTokens = convertMantissaToTokens({
    value: vault.userStakeBalanceMantissa ?? new BigNumber(0),
    token: vault.stakedToken,
  });

  const hypotheticalUserStakedTokens = fromAmountTokens?.gt(0)
    ? userStakedTokens.plus(fromAmountTokens)
    : undefined;

  const projectedUserYieldTokens =
    vault.status === VaultStatus.Refund || !vault.lockingPeriodMs
      ? new BigNumber(0)
      : getProjectedYieldTokens({
          depositTokens: userStakedTokens,
          stakeAprPercentage: vault.stakeAprPercentage,
          lockingPeriodMs: vault.lockingPeriodMs,
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
    key: 'targetApr',
    node: (
      <LabeledInlineContent
        label={t('vault.modals.targetApr')}
        tooltip={t('vault.modals.targetAprTooltip')}
      >
        {formatPercentageToReadableValue(vault.stakeAprPercentage)}
      </LabeledInlineContent>
    ),
  });

  if (accountAddress && vault.lockingPeriodMs !== undefined) {
    items.push({
      key: 'totalTargetRewards',
      node: (
        <LabeledInlineContent
          label={t('vault.modals.totalTargetRewards')}
          tooltip={t('vault.modals.institutionalDisclaimer')}
        >
          <ValueUpdate
            original={formatTokensToReadableValue({
              value: vault.userYieldTokens ?? projectedUserYieldTokens,
              token: vault.rewardToken,
            })}
            update={
              hypotheticalUserStakedTokens &&
              formatTokensToReadableValue({
                value: getProjectedYieldTokens({
                  depositTokens: hypotheticalUserStakedTokens,
                  stakeAprPercentage: vault.stakeAprPercentage,
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
