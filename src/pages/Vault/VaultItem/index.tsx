// VaultItem
/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { useTranslation } from 'translation';
import useConvertToReadableCoinString from 'hooks/useConvertToReadableCoinString';
import { convertWeiToCoins, formatToReadablePercentage } from 'utilities/common';
import { TokenId } from 'types';
import { getToken } from 'utilities';
import { Icon } from '../../../components/v2/Icon';
import { Button } from '../../../components/v2/Button';
import { useStyles } from './styles';

export const SYMBOL_TEST_ID = 'vault-item-symbol';
export const USER_PENDING_REWARD_TOKENS_TEST_ID = 'vault-item-user-pending-reward-tokens';
export const USER_STAKED_TOKENS_TEST_ID = 'vault-item-user-staked-tokens';
export const DATA_LIST_ITEM_TEST_ID = 'vault-item-data-list-item';

export interface IVaultItemProps {
  stakedTokenId: TokenId;
  rewardTokenId: TokenId;
  stakingAprPercentage: number;
  dailyEmissionWei: BigNumber;
  totalStakedWei: BigNumber;
  onClaim: () => void;
  onStake: () => void;
  onReward: () => void;
  userPendingRewardWei?: BigNumber;
  userStakedWei?: BigNumber;
  className?: string;
}

export const VaultItem = ({
  stakedTokenId,
  rewardTokenId,
  userPendingRewardWei,
  userStakedWei,
  stakingAprPercentage,
  dailyEmissionWei,
  totalStakedWei,
  onClaim,
  onStake,
  onReward,
  className,
}: IVaultItemProps) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const readableUserPendingRewardTokens = useConvertToReadableCoinString({
    valueWei: userPendingRewardWei,
    tokenId: rewardTokenId,
    minimizeDecimals: true,
  });

  const readableUserStakedTokens = useConvertToReadableCoinString({
    tokenId: stakedTokenId,
    valueWei: userStakedWei || new BigNumber(0),
    minimizeDecimals: true,
  });

  const dataListItems = useMemo(
    () => [
      {
        title: t('vaultItem.stakingApr', { stakeTokenName: getToken(stakedTokenId).symbol }),
        value: formatToReadablePercentage(stakingAprPercentage),
      },
      {
        title: t('vaultItem.dailyEmission'),
        value: (
          <>
            <Icon css={styles.tokenIcon} name={rewardTokenId} />
            {convertWeiToCoins({
              valueWei: dailyEmissionWei,
              tokenId: rewardTokenId,
              returnInReadableFormat: true,
              minimizeDecimals: true,
            })}
          </>
        ),
      },
      {
        title: t('vaultItem.totalStaked'),
        value: (
          <>
            <Icon css={styles.tokenIcon} name={stakedTokenId} />
            {convertWeiToCoins({
              valueWei: totalStakedWei,
              tokenId: stakedTokenId,
              returnInReadableFormat: true,
              minimizeDecimals: true,
            })}
          </>
        ),
      },
    ],
    [
      stakedTokenId,
      rewardTokenId,
      stakingAprPercentage,
      dailyEmissionWei.toFixed(),
      totalStakedWei.toFixed(),
    ],
  );

  return (
    <Paper css={styles.container} className={className}>
      <div css={styles.header}>
        <div css={styles.title}>
          <Icon css={styles.tokenIcon} name={stakedTokenId} />

          <Typography variant="h4" css={styles.text} data-testid={SYMBOL_TEST_ID}>
            {getToken(stakedTokenId).symbol}
          </Typography>
        </div>

        {userPendingRewardWei?.isGreaterThan(0) && (
          <div css={styles.rewardWrapper}>
            <Typography css={styles.text}>{t('vaultItem.reward')}</Typography>

            <Icon css={[styles.tokenIcon, styles.tokenIconReward]} name={rewardTokenId} />

            <Typography
              css={[styles.text, styles.textRewardValue]}
              variant="body1"
              color="textPrimary"
              data-testid={USER_PENDING_REWARD_TOKENS_TEST_ID}
            >
              {readableUserPendingRewardTokens}
            </Typography>

            <Button onClick={onClaim} variant="text" css={styles.buttonClaim}>
              {t('vaultItem.claimButton')}
            </Button>
          </div>
        )}
      </div>

      <Typography variant="small2" css={[styles.label, styles.stakingLabel]}>
        {t('vaultItem.youAreStaking')}
      </Typography>

      <Typography
        variant="h1"
        css={styles.textStakingValue}
        data-testid={USER_STAKED_TOKENS_TEST_ID}
      >
        <Icon css={[styles.tokenIconLarge]} name={stakedTokenId} />

        {readableUserStakedTokens}
      </Typography>

      <ul css={styles.dataRow}>
        {dataListItems.map(({ title, value }) => (
          <li key={title} css={styles.valueWrapper}>
            <Typography variant="small2" css={styles.label}>
              {title}
            </Typography>

            <Typography variant="h4" css={styles.textAligned} data-testid={DATA_LIST_ITEM_TEST_ID}>
              {value}
            </Typography>
          </li>
        ))}
      </ul>

      <div css={styles.buttonsWrapper}>
        <Button onClick={onStake} css={styles.button} variant="primary">
          {t('vaultItem.stakeButton')}
        </Button>

        <Button onClick={onReward} css={styles.button} variant="secondary">
          {t('vaultItem.withdrawButton')}
        </Button>
      </div>
    </Paper>
  );
};

export default VaultItem;
