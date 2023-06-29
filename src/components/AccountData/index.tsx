/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import React from 'react';
import { useTranslation } from 'translation';
import { Asset, Pool, Swap, TokenAction } from 'types';
import { formatToReadablePercentage, formatTokensToReadableValue } from 'utilities';

import { SAFE_BORROW_LIMIT_PERCENTAGE } from 'constants/safeBorrowLimitPercentage';
import useAssetInfo from 'hooks/useAssetInfo';

import { Delimiter } from '../Delimiter';
import { LabeledInlineContent } from '../LabeledInlineContent';
import { BorrowBalanceAccountHealth } from '../ProgressBar/AccountHealth';
import { ValueUpdate } from '../ValueUpdate';
import { useStyles } from './styles';
import useGetValues from './useGetValues';

export interface AccountDataProps {
  asset: Asset;
  pool: Pool;
  action: TokenAction;
  amountTokens: BigNumber;
  isUsingSwap?: boolean;
  swap?: Swap;
}

export const AccountData: React.FC<AccountDataProps> = ({
  asset,
  pool,
  action,
  amountTokens,
  isUsingSwap = false,
  swap,
}) => {
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
  } = useGetValues({ asset, pool, swap, amountTokens, action, isUsingSwap });

  const assetInfo = useAssetInfo({
    asset,
    type: action === 'borrow' || action === 'repay' ? 'borrow' : 'supply',
  });

  return (
    <>
      {assetInfo.map((row, index) => (
        <LabeledInlineContent
          css={styles.getRow({ isLast: index === assetInfo.length - 1 })}
          className="info-row"
          {...row}
          key={row.label}
        />
      ))}

      <Delimiter css={styles.getRow({ isLast: true })} />

      <BorrowBalanceAccountHealth
        css={styles.getRow({ isLast: true })}
        borrowBalanceCents={pool.userBorrowBalanceCents?.toNumber()}
        borrowLimitCents={
          hypotheticalPoolUserBorrowLimitCents?.toNumber() ?? pool.userBorrowLimitCents?.toNumber()
        }
        hypotheticalBorrowBalanceCents={
          action === 'borrow' || action === 'repay'
            ? hypotheticalPoolUserBorrowBalanceCents?.toNumber()
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
            original={pool.userBorrowLimitCents?.toNumber()}
            update={hypotheticalPoolUserBorrowLimitCents?.toNumber()}
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
