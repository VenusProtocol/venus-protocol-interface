/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import React from 'react';
import { useTranslation } from 'translation';
import { Asset, Pool } from 'types';
import { formatToReadablePercentage, formatTokensToReadableValue } from 'utilities';

import { SAFE_BORROW_LIMIT_PERCENTAGE } from 'constants/safeBorrowLimitPercentage';
import { TOKENS } from 'constants/tokens';

import { Delimiter } from '../Delimiter';
import { LabeledInlineContent, LabeledInlineContentProps } from '../LabeledInlineContent';
import { BorrowBalanceAccountHealth } from '../ProgressBar/AccountHealth';
import { ValueUpdate } from '../ValueUpdate';
import { useStyles } from './styles';
import useGetValues from './useGetValues';

interface AccountDataProps {
  asset: Asset;
  pool: Pool;
  action: 'supply' | 'withdraw' | 'borrow' | 'repay';
  amountTokens: BigNumber;
}

// TODO: add tests

export const AccountData: React.FC<AccountDataProps> = ({ asset, pool, action, amountTokens }) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const {
    poolUserBorrowLimitUsedPercentage,
    poolUserDailyEarningsCents,
    hypotheticalUserSupplyBalanceTokens,
    hypotheticalUserBorrowBalanceTokens,
    hypotheticalPoolUserBorrowBalanceCents,
    hypotheticalPoolUserBorrowLimitCents,
    hypotheticalPoolUserBorrowLimitUsedPercentage,
    hypotheticalPoolUserDailyEarningsCents,
  } = useGetValues({ asset, pool, amountTokens, action });

  // TODO: create util to generate token info
  const tokenInfo: LabeledInlineContentProps[] = asset
    ? [
        {
          label: t('accountData.supplyApy'),
          iconSrc: asset.vToken.underlyingToken,
          children: formatToReadablePercentage(asset.supplyApyPercentage),
        },
        {
          label: t('accountData.distributionApy'),
          iconSrc: TOKENS.xvs,
          children: formatToReadablePercentage(asset.xvsSupplyApy),
        },
      ]
    : [];

  return (
    <>
      {tokenInfo.map((row, index) => (
        <LabeledInlineContent
          css={styles.getRow({ isLast: index === tokenInfo.length - 1 })}
          className="info-row"
          {...row}
          key={row.label}
        />
      ))}

      <Delimiter css={styles.getRow({ isLast: true })} />

      <BorrowBalanceAccountHealth
        css={styles.getRow({ isLast: true })}
        borrowBalanceCents={pool.userBorrowBalanceCents}
        borrowLimitCents={hypotheticalPoolUserBorrowLimitCents ?? pool.userBorrowLimitCents}
        hypotheticalBorrowBalanceCents={
          action === 'borrow' || action === 'repay'
            ? hypotheticalPoolUserBorrowBalanceCents
            : undefined
        }
        safeBorrowLimitPercentage={SAFE_BORROW_LIMIT_PERCENTAGE}
      />

      {action === 'supply' || action === 'withdraw' ? (
        <LabeledInlineContent
          label={t('accountData.supplyBalance', {
            tokenSymbol: asset.vToken.underlyingToken.symbol,
          })}
          css={styles.getRow({ isLast: false })}
        >
          <ValueUpdate
            original={asset.userSupplyBalanceTokens}
            update={hypotheticalUserSupplyBalanceTokens}
            format={(value: BigNumber | undefined) =>
              formatTokensToReadableValue({
                value,
                token: asset.vToken.underlyingToken,
                minimizeDecimals: true,
                addSymbol: false,
              })
            }
          />
        </LabeledInlineContent>
      ) : (
        <LabeledInlineContent
          label={t('accountData.borrowBalance', {
            tokenSymbol: asset.vToken.underlyingToken.symbol,
          })}
          css={styles.getRow({ isLast: false })}
        >
          <ValueUpdate
            original={asset.userBorrowBalanceTokens}
            update={hypotheticalUserBorrowBalanceTokens}
            positiveDirection="desc"
            format={(value: BigNumber | undefined) =>
              formatTokensToReadableValue({
                value,
                token: asset.vToken.underlyingToken,
                minimizeDecimals: true,
                addSymbol: false,
              })
            }
          />
        </LabeledInlineContent>
      )}

      {action === 'supply' || action === 'withdraw' ? (
        <LabeledInlineContent
          label={t('accountData.borrowLimit')}
          css={styles.getRow({ isLast: false })}
        >
          <ValueUpdate
            original={pool.userBorrowLimitCents}
            update={hypotheticalPoolUserBorrowLimitCents}
          />
        </LabeledInlineContent>
      ) : (
        <LabeledInlineContent
          label={t('accountData.borrowLimitUsed')}
          css={styles.getRow({ isLast: false })}
        >
          <ValueUpdate
            original={poolUserBorrowLimitUsedPercentage}
            update={hypotheticalPoolUserBorrowLimitUsedPercentage}
            positiveDirection="desc"
            format={formatToReadablePercentage}
          />
        </LabeledInlineContent>
      )}

      <LabeledInlineContent
        label={t('accountData.dailyEarnings')}
        css={styles.getRow({ isLast: true })}
        className="info-row"
      >
        <ValueUpdate
          original={poolUserDailyEarningsCents}
          update={hypotheticalPoolUserDailyEarningsCents}
        />
      </LabeledInlineContent>
    </>
  );
};
