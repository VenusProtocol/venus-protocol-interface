// VaultItem
/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { useTranslation } from 'translation';
import { convertWeiToCoins, formatToReadablePercentage } from 'utilities/common';
import { TokenId } from 'types';
import { getToken } from 'utilities';
import { Icon } from '../../../components/v2/Icon';
import { Button } from '../../../components/v2/Button';
import { useStyles } from './styles';

export interface IVaultItemProps {
  tokenId: TokenId;
  rewardTokenId: TokenId;
  rewardWei?: BigNumber;
  userStakedWei: BigNumber;
  stakingAprPercentage: number;
  dailyEmissionWei: BigNumber;
  totalStakedWei: BigNumber;
  onClaim: () => void;
  onStake: () => void;
  onReward: () => void;
  className?: string;
}

export const VaultItem = ({
  tokenId,
  rewardTokenId,
  rewardWei,
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

  const dataListItems = useMemo(
    () => [
      {
        title: t('vaultItem.stakingApr', { stakeTokenName: getToken(tokenId).symbol }),
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
            })}
          </>
        ),
      },
      {
        title: t('vaultItem.totalStaked'),
        value: (
          <>
            <Icon css={styles.tokenIcon} name={tokenId} />
            {convertWeiToCoins({
              valueWei: totalStakedWei,
              tokenId,
              returnInReadableFormat: true,
            })}
          </>
        ),
      },
    ],
    [tokenId, rewardTokenId, stakingAprPercentage, dailyEmissionWei, totalStakedWei],
  );

  return (
    <Paper css={styles.container} className={className}>
      <div css={styles.header}>
        <div css={styles.title}>
          <Icon css={styles.tokenIcon} name={tokenId} />

          <Typography variant="h4" css={styles.text}>
            {getToken(tokenId).symbol}
          </Typography>
        </div>

        {rewardWei?.isGreaterThan(0) && (
          <div css={styles.rewardWrapper}>
            <Typography css={styles.text}>{t('vaultItem.reward')}</Typography>

            <Icon css={[styles.tokenIcon, styles.tokenIconReward]} name={rewardTokenId} />

            <Typography
              css={[styles.text, styles.textRewardValue]}
              variant="body1"
              color="textPrimary"
            >
              {convertWeiToCoins({
                valueWei: rewardWei,
                tokenId: rewardTokenId,
                returnInReadableFormat: true,
              })}
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

      <Typography variant="h1" css={styles.textStakingValue}>
        <Icon css={[styles.tokenIcon, styles.tokenIconLarge]} name={tokenId} />

        {convertWeiToCoins({
          tokenId,
          valueWei: userStakedWei,
          returnInReadableFormat: true,
        })}
      </Typography>

      <ul css={styles.dataRow}>
        {dataListItems.map(({ title, value }) => (
          <li key={title} css={styles.valueWrapper}>
            <Typography variant="small2" css={styles.label}>
              {title}
            </Typography>

            <Typography variant="h4" css={styles.textAligned}>
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
